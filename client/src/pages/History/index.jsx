import { useEffect, useState, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MainContent from './components/MainContent';

import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
`;

const Rightbar = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const History = () => {
  const [searchText, setSearchText] = useState();

  return (
    <Wrapper>
      <Sidebar />
      <Rightbar>
        <Header searchText={searchText} setSearchText={setSearchText} />
        <MainContent searchText={searchText} setSearchText={setSearchText} />
      </Rightbar>
    </Wrapper>
  );
};

export default History;
