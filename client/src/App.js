import { Outlet } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
// import { Reset } from 'styled-reset';

import Footer from './components/Footer';
import Header from './components/Header';
import { AuthContextProvider } from './contexts/authContext';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    ${'' /* border: 1px solid black !important */}

  }
  body {
    font-family: 'Noto Sans TC', sans-serif;
  }

  #root {
    min-height: 100vh;
    padding: 140px 0 115px;
    position: relative;
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
