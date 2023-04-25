import React from 'react';
import styled from 'styled-components';

import WorkflowTable from './Workflow';

const Wrapper = styled.div`
  flex: 1;
  background-color: #fff;
`;

const MainContent = (searchText, setSearchText) => {
  return (
    <Wrapper>
      <WorkflowTable searchText={searchText} setSearchText={setSearchText}></WorkflowTable>
    </Wrapper>
  );
};

export default MainContent;
