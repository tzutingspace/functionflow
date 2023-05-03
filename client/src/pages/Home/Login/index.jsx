import { useState, useContext } from 'react';
import styled from 'styled-components';
import ReactLoading from 'react-loading';
import { AuthContext } from '../../../contexts/authContext';

const Loading = styled(ReactLoading)`
  margin-top: 50px;
`;

const Text = styled.div`
  font-size: 23px;
  letter-spacing: 0.5px;
  line-height: 1.4;
  margin: 8px auto 32px;
`;

const InputInline = styled.div`
  position: relative;
  left: 0px;
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  height: 100%;
`;

const UserInput = styled.input`
  background-color: #efefef;
  border: none;
  border-radius: 20px;
  padding: 12px 0 12px 24px;
  font-size: 14px;
  width: 100%;
  overflow: hidden;
  height: 1rem;

  &::placeholder {
    color: #20315b58;
    font-size: 14px;
    opacity: 1;
  }
`;

// 登入按鈕和註冊按鈕
const LogInButton = styled.button`
  cursor: pointer;
  border: none;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  color: #20315b;
  font-size: 14px;
  letter-spacing: 1px;
  overflow: hidden;
  padding: 14px 8px;
  width: 100%;
  color: linear-gradient(0deg, #293e56, #4266ae);
  height: 4rem;
  outline: none;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  line-height: 0.5rem;
`;

const SwitchText = styled.div`
  text-align: center;
  text-decoration: underline;
  text-shadow: none;
  font-size: 12px;
  color: hsla(200, 18%, 58%, 1);
  cursor: pointer;
  display: block;
  margin-top: 16px;
`;

const Login = ({ onFormSwitch }) => {
  const { login, loading } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    login(email, password, 'native');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const renderContent = () => {
    if (loading) return <Loading type="spinningBubbles" color="#313538" />;
    return (
      <>
        <Text>Log in to your account</Text>
        <InputInline>
          <UserInput
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></UserInput>
        </InputInline>
        <InputInline>
          <UserInput
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
          ></UserInput>
        </InputInline>
        <LogInButton onClick={() => handleLogin()}>Login</LogInButton>
        <SwitchText onClick={() => onFormSwitch('signup')}>
          Don't have an account yet? Register here.
        </SwitchText>
      </>
    );
  };

  return <>{renderContent()}</>;
};

export default Login;
