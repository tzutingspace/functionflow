import { useState, useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import ReactLoading from 'react-loading';
import { AuthContext } from '../../contexts/authContext';
import logo from './logo.png';
import mainImage from './mainimage.png';

// 頁面全局樣式
const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

// Header 組件
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  margin-bottom: 20px;
  background-color: #f9f9f9;
`;

const HeadName = styled.div`
  font-size: 36px;
  font-weight: bold;
  color: #20315b;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

const HeaderRight = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

// Header 左側 Logo
const Logo = styled(Link)`
  width: 48px;
  height: 48px;
  background-image: url(${logo});
  background-size: contain;
  background-color: #ccc; /* 示例顏色 */
  margin-right: 16px;
`;

const HeadButton = styled(Link)`
  margin-left: 16px;
  padding: 8px 20px; /* 內邊距 */
  margin-right: 20px; /* 右邊間距 */
  background-color: #20315b;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  padding: 10px 16px;
  border: none;
  cursor: pointer;
  text-decoration: none;
  border-radius: 20px; /* 圓弧造型 */
`;

const Loading = styled(ReactLoading)`
  margin-top: 50px;
`;

// 主區塊
const Main = styled.div`
  display: flex;
  max-width: 2048px;
  margin: 0px;
  padding: 0px;
  height: 100%;
`;

// 左側區塊
const LeftArea = styled.div`
  display: block;
  margin: auto;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 48px 20px 20px 48px;
  background-color: white;
  border-radius: 10px;
`;

const LeftInnerBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0px;
  max-width: 320px;
  padding: 0px;
`;

// 右側區塊
const RightArea = styled.div``;

const UserInput = styled.input`
  height: 40px;
  width: 250px;
  margin-top: 24px;
`;

const Content = styled.div`
  margin-top: 24px;
`;

// 登入按鈕和註冊按鈕
const LogoutButton = styled.button`
  height: 40px;
  border-radius: 5px;
  border: none;
  background-color: #20315b;
  color: white;
  margin-top: 24px;
  margin-bottom: 10px;
  cursor: pointer;
`;

const DescriptionImage = styled.div`
  flex: 1;
  background-size: cover;
  background-position: center;
  background-image: url(${mainImage});
`;

const Home = () => {
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
      <Header>
        <HeaderLeft>
          <Logo to="/"></Logo>
          <HeadName>Function Flow</HeadName>
        </HeaderLeft>
        <HeaderRight>
          <HeadButton to="/">Profile</HeadButton>
          <HeadButton to="/workflows"> Workflows</HeadButton>
          <HeadButton to="/edit">New+</HeadButton>
        </HeaderRight>
      </Header>
      <Main>
        <LeftArea>
          <LeftInnerBlock>{renderContent()}</LeftInnerBlock>
        </LeftArea>
      </Main>
    </Wrapper>
  );
};

export default Home;
