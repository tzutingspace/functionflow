// import React from 'react';
// import styled from 'styled-components';
// import { useContext } from 'react';
// import { Link } from 'react-router-dom';
// import { AuthContext } from '../../../contexts/authContext';

// const Wrapper = styled.div`
//   width: 12%;
//   background-color: #20315b;
//   box-sizing: border-box;
//   flex-direction: column;
//   justify-content: flex-start;
//   padding-top: 20px;
// `;

// const Item = styled(Link)`
//   color: #dfd1aa;
//   align-content: flex-start;
//   align-items: center;
//   box-sizing: border-box;
//   display: flex;
//   flex-shrink: 0;
//   flex-wrap: wrap;
//   height: 40px;
//   justify-content: flex-start;
//   overflow-x: hidden;
//   overflow-y: hidden;
//   padding-left: 16px;
//   padding-right: 16px;
//   position: relative;
//   font-size: 16px;
//   text-decoration: none;
//   font-weight: 560;
// `;

// const FlexGrow = styled.div`
//   box-sizing: border-box;
//   display: block;
//   flex-grow: 1;
// `;

// const Sidebar = () => {
//   const { user, isLogin, login, logout, loading } = useContext(AuthContext);

//   return (
//     <Wrapper>
//       {console.log(user)}
//       <Item>{`Hi, ${user.name}`}</Item>
//       <Item></Item>
//       <Item to="/history">Workflows</Item>
//       <Item>Sources</Item>
//       <Item to="/">Accounts</Item>
//       <Item>Data Stores</Item>
//       <Item>Settings</Item>
//       <FlexGrow></FlexGrow>
//       <Item></Item>
//       <Item></Item>
//       <Item>Explore</Item>
//       <Item>Community</Item>
//       <Item>Help & Docs</Item>
//     </Wrapper>
//   );
// };

// export default Sidebar;
