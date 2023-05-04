import { useEffect, useContext } from 'react';
import Sidebar from '../../components/Sidebar';
import MainContent from './components/MainContent';
import { AuthContext } from '../../contexts/authContext';
import styled from 'styled-components';

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
`;

const Workflows = () => {
  const { isLogin, loading } = useContext(AuthContext);

  useEffect(() => {
    if (!loading && !isLogin) {
      window.location.href = `/`;
    }
  }, [loading]);

  return (
    <>
      {!isLogin ? (
        <></>
      ) : (
        <Wrapper>
          <Sidebar />
          <Rightbar>
            <MainContent />
          </Rightbar>
          <ToastContainer />
        </Wrapper>
      )}
    </>
  );
};

export default Workflows;
