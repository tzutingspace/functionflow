import { useState, useContext } from 'react';
import styled from 'styled-components';
import ReactLoading from 'react-loading';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthContext } from '../../../contexts/authContext';

import { ValidUsername, ValidateEmail, ValidatePassword } from '../../../utils/utils';

const Loading = styled(ReactLoading)`
  margin-top: 50px;
`;

const Text = styled.div`
  font-size: 23px;
  letter-spacing: 0.5px;
  line-height: 1.4;
  margin: 8px auto 32px;
  font-weight: bold;
  color: #20315b;
`;

const InputInline = styled.div`
  position: relative;
  left: 0px;
  display: flex;
  align-items: center;
  margin-top: 12px;
  height: 100%;
`;

const UserInput = styled.input`
  background-color: #efefef;
  border: none;
  border-radius: 20px;
  padding: 12px 0 12px 24px;
  font-size: 12px;
  width: 100%;
  overflow: hidden;
  height: 1rem;

  &::placeholder {
    color: #20315b58;
    font-size: 12px;
    opacity: 1;
  }
`;

// 登入按鈕和註冊按鈕
const SignupButton = styled.button`
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
  margin-top: 12px;
`;

const SwitchText = styled.div`
  text-align: center;
  text-decoration: underline;
  text-shadow: none;
  font-size: 14px;
  color: hsla(200, 18%, 58%, 1);
  cursor: pointer;
  display: block;
  margin-top: 16px;
`;

const UserAlert = styled.div`
  color: red;
  font-size: 5px;
  align-items: center;
  position: relative;
  left: 20px;
  display: flex;
  width: 90%;
`;

const Signup = ({ onFormSwitch }) => {
  const { signup, loading, ErrorMessage } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [usernameError, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleSignup = () => {
    // 確認name
    if (!ValidUsername(name) || !name) {
      setUsernameError(true);
      return;
    }

    // 確認email
    if (!ValidateEmail(email)) {
      setEmailError(true);
      return;
    }
    // 確認password
    if (!ValidatePassword(password)) {
      setPasswordError(true);
      return;
    }

    signup(name, email, password, 'native');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSignup();
    }
  };

  const handleUsername = (e) => {
    const inputText = e.target.value;
    if (!ValidUsername(inputText) || inputText.length > 20) {
      setUsernameError(true);
      return;
    }
    setName(inputText);
    setUsernameError(false);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setUsernameError(false);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setPasswordError(false);
  };

  const renderContent = () => {
    if (loading) return <Loading type="spinningBubbles" color="#313538" />;
    return (
      <>
        <Text>Sign Up for Free</Text>
        <InputInline>
          <UserInput
            type="name"
            placeholder="Enter your Username"
            value={name}
            onChange={(e) => handleUsername(e)}
          ></UserInput>
        </InputInline>
        {usernameError && (
          <UserAlert>{`Username must be 1-20 characters, no special characters.`}</UserAlert>
        )}
        <InputInline>
          <UserInput
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => handleEmail(e)}
          ></UserInput>
        </InputInline>
        {emailError && <UserAlert>{`Please enter legal email.`}</UserAlert>}
        <InputInline>
          <UserInput
            type="password"
            placeholder="Enter your password (6-16 characters)"
            value={password}
            onChange={(e) => handlePassword(e)}
            onKeyPress={handleKeyPress}
          ></UserInput>
        </InputInline>
        {passwordError && <UserAlert>{`Password must be 6-16 characters.`}</UserAlert>}
        {ErrorMessage && <UserAlert>{ErrorMessage}</UserAlert>}
        <SignupButton onClick={handleSignup}>Registration</SignupButton>
        <SwitchText onClick={() => onFormSwitch('login')}>
          Already have an account? Login Here.
        </SwitchText>
      </>
    );
  };

  return <>{renderContent()}</>;
};

export default Signup;
