import { useEffect, useContext } from 'react';
import Sidebar from '../../components/Sidebar';
import MainContent from './components/MainContent';
import { AuthContext } from '../../contexts/authContext';
import styled from 'styled-components';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

const RightBar = styled.div`
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
          <RightBar>
            <MainContent />
          </RightBar>
          <ToastContainer />
        </Wrapper>
      )}
    </>
  );
};

export default Workflows;
