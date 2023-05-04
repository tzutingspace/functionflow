import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { result } from 'lodash';

export const AuthContext = createContext({
  isLogin: false,
  user: {},
  loading: false,
  jwtToken: '',
  ErrorMessage: '',
  signup: () => {},
  login: () => {},
  logout: () => {},
  setErrorMessage: () => {},
});

export const AuthContextProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [jwtToken, setJwtToken] = useState();

  const [ErrorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // console.log('@authContext useEffect');
    const checkAuthStatus = async () => {
      const localJwtToken = localStorage.getItem('jwtToken');
      if (localJwtToken) {
        try {
          const userData = await API.getProfile(localJwtToken);
          setJwtToken(localJwtToken);
          setUser(userData);
          setIsLogin(true);
          navigate('/workflows'); //直接到使用者首頁
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
    try {
      setLoading(true);
      const result = await API.signup({ name, email, password, provider });
      const { access_token: tokenFromServer, user: userData } = result;
      setUser(userData);
      setJwtToken(tokenFromServer);
      window.localStorage.setItem('jwtToken', tokenFromServer);
      setIsLogin(true);
      setLoading(false);
      navigate('/workflows');
    } catch (error) {
      // 登入失敗要處理
      setErrorMessage(error.response.data.data.message);
      setLoading(false);
    }
  };

  const login = async (email, password, provider) => {
    // console.log('login...', email, password, provider);
    try {
      setLoading(true);
      const result = await API.login({ email, password, provider });
      const { access_token: tokenFromServer, user: userData } = result;
      setUser(userData);
      setJwtToken(tokenFromServer);
      window.localStorage.setItem('jwtToken', tokenFromServer);
      setIsLogin(true);
      setLoading(false);
      navigate('/workflows');
    } catch (error) {
      console.log('error', error.response);
      setErrorMessage(error.response.data.data.message);
      setLoading(false);
    }
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
        ErrorMessage,
        setErrorMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
