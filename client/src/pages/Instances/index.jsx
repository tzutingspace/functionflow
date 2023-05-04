import React, { useEffect, useState, useMemo, useContext } from 'react';
import styled from 'styled-components/macro';

import MainContent from './MainContent';
import Sidebar from '../../components/Sidebar';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

const Rightbar = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 80%;
`;

const Instances = () => {
  return (
    <Wrapper>
      <Sidebar />
      <Rightbar>
        <MainContent />
      </Rightbar>
      <ToastContainer />
    </Wrapper>
  );
};

export default Instances;
