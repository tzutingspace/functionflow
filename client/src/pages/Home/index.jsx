import styled from 'styled-components';
import { useState, useEffect, useContext, useCallback } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthContext } from '../../contexts/authContext';
import api from '../../utils/api';

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 70px 0 46px;
  /* display: flex; */
  flex-wrap: wrap;
`;

const Title = styled.div`
  font-size: 60px;
  line-height: 64px;
`;

const Home = () => {
  const { user } = useContext(AuthContext);
  console.log('Home', user);

  return (
    <Wrapper>
      {/* <Header></Header> */}
      <Title>Function Flow</Title>
    </Wrapper>
  );
};

export default Home;
