import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 20%;
  background-color: #f0f0f0;
`;

const Item = styled.div``;

const Sidebar = () => {
  return (
    <Wrapper>
      <Item>User Name</Item>
      <Item>Workflow</Item>
      <Item>Help & Docs</Item>
    </Wrapper>
  );
};

export default Sidebar;
