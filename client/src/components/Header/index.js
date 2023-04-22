import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import logo from './logo.png';
import profile from './profile.png';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 60px;
  width: 100%;
  padding: 6px;
  z-index: 99;
  background-color: white;
  display: flex;
  align-items: center;
  box-sizing: border-box;
`;

const Logo = styled(Link)`
  width: 40px;
  height: 40px;
  margin-left: 10px;
  margin-right: 10px;
  background-image: url(${logo});
  background-size: contain;
  background-repeat: no-repeat;
`;

const PageLinks = styled.div`
  margin-left: 720px;
  display: flex;
`;

const PageLink = styled(Link)`
  width: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: 42px;
`;

const PageLinkIcon = styled.div`
  width: 44px;
  height: 44px;
  cursor: pointer;
  background-size: contain;
  position: relative;
`;

const PageLinkProfileIcon = styled(PageLinkIcon)`
  background-image: url(${({ url }) => url ?? profile});
  border-radius: 50%;
`;

const PageLinkText = styled.div`
  display: none;
`;

function Header() {
  return (
    <Wrapper>
      <Logo to="/" />
      <h1>Function Flow</h1>
      <PageLinks>
        <PageLink to="/profile">
          <PageLinkProfileIcon icon={profile} />
          <PageLinkText>會員</PageLinkText>
        </PageLink>
      </PageLinks>
    </Wrapper>
  );
}

export default Header;
