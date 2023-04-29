import Sidebar from '../../components/Sidebar';
import MainContent from './components/MainContent';

import styled from 'styled-components';

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
  return (
    <Wrapper>
      <Sidebar />
      <Rightbar>
        <MainContent />
      </Rightbar>
    </Wrapper>
  );
};

export default Workflows;
