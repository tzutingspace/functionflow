import { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext({
  isLogin: false,
  user: {},
  loading: false,
  jwtToken: '',
  login: () => {},
  logout: () => {},
});

export const AuthContextProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [jwtToken, setJwtToken] = useState();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const localJwtToken = localStorage.getItem('jwtToken');
      if (localJwtToken) {
        setJwtToken(localJwtToken);
        const userData = await api.getProfile(localJwtToken);
        setUser(userData);
        setIsLogin(true);
      } else {
        window.localStorage.removeItem('jwtToken');
      }
      setLoading(false);
    };
    checkAuthStatus();
  }, []);

  const login = async (email, password, provider) => {
    console.log('login', email, password, provider);
    setLoading(true);
    const result = await api.login({ email, password, provider });
    const { access_token: tokenFromServer, user: userData } = result;
    setUser(userData);
    setJwtToken(tokenFromServer);
    window.localStorage.setItem('jwtToken', tokenFromServer);
    setIsLogin(true);
    setLoading(false);
  };

  const logout = async () => {
    console.log('logout');
    setLoading(true);
    setIsLogin(false);
    setUser({});
    setJwtToken();
    window.localStorage.removeItem('jwtToken');
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLogin,
        user,
        loading,
        jwtToken,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
