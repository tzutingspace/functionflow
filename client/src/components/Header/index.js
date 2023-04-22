import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

// import { AuthContext } from '../../context/authContext';
import logo from './logo.png';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100px;
  width: 100%;
  padding: 0 20px 0 20px;
  border-bottom: 20px solid #313538;
  z-index: 99;
  background-color: white;
  display: flex;
  align-items: center;
`;

const Logo = styled(Link)`
  width: 48px;
  height: 48px;
  background-image: url(${logo});
  background-size: contain;
  background-repeat: no-repeat;
`;

function Header() {
  return (
    <Wrapper>
      <Logo to="/" />
      <h1>Function Flow</h1>
    </Wrapper>
  );
}

// export default Header;
