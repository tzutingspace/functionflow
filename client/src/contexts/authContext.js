import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

export const AuthContext = createContext({
  isLogin: false,
  user: {},
  loading: false,
  jwtToken: '',
  signup: () => {},
  login: () => {},
  logout: () => {},
});

export const AuthContextProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [jwtToken, setJwtToken] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const localJwtToken = localStorage.getItem('jwtToken');
      console.log('@authContext useEffect');
      if (localJwtToken) {
        try {
          const userData = await API.getProfile(localJwtToken);
          setJwtToken(localJwtToken);
          setUser(userData);
          setIsLogin(true);
          // console.log('useEffect userData', userData);
        } catch (error) {
          console.log('@authContext useEffect, JWT驗證失敗');
          window.localStorage.removeItem('jwtToken');
          navigate('/');
        }
      }
      setLoading(false);
    };
    checkAuthStatus();
  }, []);

  const signup = async (name, email, password, provider) => {
    setLoading(true);
    const result = await API.signup({ name, email, password, provider });
    const { access_token: tokenFromServer, user: userData } = result;
    setUser(userData);
    setJwtToken(tokenFromServer);
    window.localStorage.setItem('jwtToken', tokenFromServer);
    setIsLogin(true);
    setLoading(false);
    // FIXME: 如果登入失敗要處理
    navigate('/workflows');
  };

  const login = async (email, password, provider) => {
    // console.log('login...', email, password, provider);
    setLoading(true);
    const result = await API.login({ email, password, provider });
    const { access_token: tokenFromServer, user: userData } = result;
    setUser(userData);
    setJwtToken(tokenFromServer);
    window.localStorage.setItem('jwtToken', tokenFromServer);
    setIsLogin(true);
    setLoading(false);
    // FIXME: 如果登入失敗要處理
    navigate('/workflows');
  };

  const logout = async () => {
    console.log('logout');
    setLoading(true);
    setIsLogin(false);
    setUser({});
    setJwtToken();
    window.localStorage.removeItem('jwtToken');
    setLoading(false);
    navigate('/');
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
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
