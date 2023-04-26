import React from 'react';
import styled from 'styled-components';

import WorkflowTable from './WorkflowTable';

const Wrapper = styled.div`
  flex: 1;
  background-color: #fff;
`;

const MainContent = () => {
  return (
    <Wrapper>
      <WorkflowTable></WorkflowTable>
    </Wrapper>
  );
};

export default MainContent;
