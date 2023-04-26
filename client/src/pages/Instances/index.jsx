import React, { useEffect, useState, useMemo, useContext } from 'react';
import styled from 'styled-components';

import MainContent from './MainContent';
import Sidebar from '../../components/Sidebar';

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

const Rightbar = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Instances = () => {
  return (
    <Wrapper>
      <Sidebar />
      <Rightbar>
        <MainContent />
      </Rightbar>
    </Wrapper>
  );
};

export default Instances;
