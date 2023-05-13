import { Outlet } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';

import { AuthContextProvider } from './contexts/authContext';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Noto Sans TC', sans-serif;
    margin: 0;
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <AuthContextProvider>
        <Outlet />
      </AuthContextProvider>
    </>
  );
}

export default App;
