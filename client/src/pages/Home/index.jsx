import styled from 'styled-components';
import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/authContext';

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 70px 0 46px;
  display: flex;
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
      <Title>Function Flow</Title>
    </Wrapper>
  );
};

export default Home;
