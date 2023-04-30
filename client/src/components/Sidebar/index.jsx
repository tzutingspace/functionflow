import React from 'react';
import styled from 'styled-components';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/authContext';

import { RiLogoutBoxRLine } from 'react-icons/ri';
import { FcWorkflow } from 'react-icons/fc';
import { MdManageAccounts } from 'react-icons/md';
import { BsBook } from 'react-icons/bs';

const Wrapper = styled.div`
  position: relative; /* 加上這行，讓裡面的 ItemGroup 能以此為參考位置 */
  width: 12rem;
  background-color: #20315b;
  box-sizing: border-box;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-top: 0.5rem;
  height: 100vh;
  overflow-y: hidden;
  align-items: center;

  /* 加上這段 */
  & > div:last-child {
    position: absolute;
    bottom: 20px;
    left: 0;
    right: 0;
  }
`;

const WeclomeMessage = styled.div`
  color: #dfd1aa;
  box-sizing: border-box;
  flex-shrink: 0;
  flex-wrap: wrap;
  height: 40px;
  overflow-x: hidden;
  overflow-y: hidden;
  padding-left: 12px;
  position: relative;
  font-size: 24px;
  text-decoration: underline;
  font-weight: 560;
`;

const ItemGroup = styled.div`
  /* border: 1px solid red; */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  list-style: none;
  margin: 0;
  padding: 0;
  flex-grow: 1;
  margin-top: 1.2rem;
`;

const ItemWrapper = styled(Link)`
  display: flex;
  align-content: flex-start;
  flex-shrink: 0;
  flex-wrap: wrap;
  height: 40px;
  box-sizing: border-box;
  white-space: nowrap;
  width: 100%;
  text-decoration: none;
  padding-left: 0.5rem;
`;

const ItemSpan = styled.span`
  color: #dfd1aa;
  box-sizing: border-box;
  height: 40px;
  font-size: 16px;
  font-weight: 560;
  line-height: 40px;
  tab-size: 4;
  white-space: nowrap;
  margin: 0px 0px 0px 16px;
  padding: 0px;
`;

const IconDiv = styled.div`
  width: 40px;
  height: 40px;
  margin: 0px;
  padding: 0px;
  align-items: center;
  display: flex;
  justify-content: center;
  tab-size: 4;
  white-space: nowrap;
  justify-items: normal;
  justify-self: auto;
`;

const FcWorkflowIcon = styled(FcWorkflow)`
  cursor: pointer;
  width: 40px;
  height: 40px;
  filter: invert(1) sepia(90%);
`;

const SignOutIcon = styled(RiLogoutBoxRLine)`
  color: #dfd1aa;
  cursor: pointer;
  width: 40px;
  height: 40px;
`;

const MdManageAccountsIcon = styled(MdManageAccounts)`
  color: #dfd1aa;
  cursor: pointer;
  width: 40px;
  height: 40px;
`;

const BsBookIcon = styled(BsBook)`
  color: #dfd1aa;
  cursor: pointer;
  width: 40px;
  height: 40px;
`;

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <Wrapper>
      <ItemGroup>
        <WeclomeMessage>{`Hi, ${user.name}`}</WeclomeMessage>
      </ItemGroup>
      <ItemGroup>
        <ItemWrapper to="/workflows">
          <IconDiv>
            <FcWorkflowIcon></FcWorkflowIcon>
          </IconDiv>
          <ItemSpan>Workflows</ItemSpan>
        </ItemWrapper>
      </ItemGroup>
      <ItemGroup>
        <ItemWrapper to="/workflows">
          <IconDiv>
            <MdManageAccountsIcon></MdManageAccountsIcon>
          </IconDiv>
          <ItemSpan>Accounts</ItemSpan>
        </ItemWrapper>
      </ItemGroup>
      <ItemGroup>
        <ItemWrapper to="/">
          <IconDiv>
            <BsBookIcon></BsBookIcon>
          </IconDiv>
          <ItemSpan>Help & Docs</ItemSpan>
        </ItemWrapper>
      </ItemGroup>
      <ItemGroup>
        <ItemWrapper to="/">
          <IconDiv>
            <SignOutIcon></SignOutIcon>
          </IconDiv>
          <ItemSpan onClick={() => logout()}>Logout</ItemSpan>
        </ItemWrapper>
      </ItemGroup>
    </Wrapper>
  );
};

export default Sidebar;
