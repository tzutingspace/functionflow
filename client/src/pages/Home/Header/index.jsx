import { useContext } from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import logo from './logo.png';

import { AuthContext } from '../../../contexts/authContext';

// Header 組件
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  margin-bottom: 0px;
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

const HomeHead = () => {
  const { isLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (isLogin) {
  //     navigate('/workflows');
  //   }
  //   return;
  // }, [isLogin]);

  return (
    <Header>
      <HeaderLeft>
        <Logo to="/"></Logo>
        <HeadName>Function Flow</HeadName>
      </HeaderLeft>
      <HeaderRight>
        {/* <HeadButton to="/">Profile</HeadButton>
        <HeadButton to="/workflows"> Workflows</HeadButton>
        <HeadButton to="/edit">New+</HeadButton> */}
      </HeaderRight>
    </Header>
  );
};

export default HomeHead;
