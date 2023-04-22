import { useState, useContext } from 'react';
import styled from 'styled-components';
import ReactLoading from 'react-loading';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/authContext';

const Wrapper = styled.div`
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Title = styled.div`
  padding-bottom: 16px;
  border-bottom: 1px solid #979797;
  font-size: 24px;
  font-weight: bold;
`;

const Content = styled.div`
  margin-top: 24px;
`;

const LogoutButton = styled.button`
  margin-top: 24px;
`;

const Loading = styled(ReactLoading)`
  margin-top: 50px;
`;

const UserInput = styled.input`
  margin-top: 24px;
`;

const BackToHome = styled.button`
  width: 100px;
  color: #000000;
`;

function Profile() {
  const { user, isLogin, login, logout, loading } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('handleLogin.....');
    login(email, password, 'native');
  };

  const renderContent = () => {
    if (loading) return <Loading type="spinningBubbles" color="#313538" />;
    if (isLogin)
      return (
        <>
          <Content>{`Name: ${user.name}`}</Content>
          <Content>{`Email: ${user.email}`}</Content>
          <LogoutButton onClick={logout}>登出</LogoutButton>
        </>
      );
    return (
      <>
        <UserInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></UserInput>
        <UserInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></UserInput>
        <LogoutButton onClick={handleLogin}>登入</LogoutButton>
      </>
    );
  };

  return (
    <Wrapper>
      <Title>會員基本資訊</Title>
      {renderContent()}
      <BackToHome>
        <Link to="/">Home</Link>
      </BackToHome>
    </Wrapper>
  );
}

export default Profile;
