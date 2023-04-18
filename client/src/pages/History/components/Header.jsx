import React from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

const Wrapper = styled.div`
  background-color: #333;
  color: #fff;
  padding: 20px;
  display: flex;
  justify-content: space-between;
`;

const HeadTitle = styled.div`
  font-weight: bold;
  font-size: larger;
  margin-right: auto;
`;

const HeadSearch = styled.input`
  width: 300px;
  padding-right: 50px;
  margin: 0px 4px;
`;

const AddWorkflow = styled.button`
  width: 100px;
  color: #000000;
`;

const Header = (searchText, setSearchText) => {
  return (
    <Wrapper>
      <HeadTitle>Workflows</HeadTitle>
      <HeadSearch placeholder="maybe it will be a search bar"></HeadSearch>
      <AddWorkflow>
        <Link to="/createworkflow">New +</Link>
      </AddWorkflow>
    </Wrapper>
  );
};

export default Header;
