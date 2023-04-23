import styled from 'styled-components';
import { useState, useContext } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthContext } from '../../contexts/authContext';

import { useEffect } from 'react';

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 70px 0 46px;
  /* display: flex; */
  flex-wrap: wrap;
`;

const Title = styled.div`
  font-size: 60px;
  line-height: 64px;
`;

// const Home = () => {
//   const { user } = useContext(AuthContext);
//   console.log('Home', user);

//   const discordOAuth = () => {
//     console.log('discordOauth');
//     window.open(
//       'https://discord.com/oauth2/authorize?client_id=1091689250522681374&permissions=2048&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fapi%2Ftest&response_type=code&scope=bot%20email%20webhook.incoming%20identify',
//       'popup',
//       'popup=true'
//     );
//   };

//   return (
//     <Wrapper>
//       {/* <Header></Header> */}
//       <Title>Function Flow</Title>
//       <button onClick={() => discordOAuth()}>Auth</button>
//     </Wrapper>
//   );
// };

// export default Home;

const CLIENT_ID = '1091689250522681374';
const REDIRECT_URI = 'http://localhost:3000/';
const SCOPE = 'identify email bot';
const DISCORD_AUTH_URL = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&permissions=2048&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}`;

const Home = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState([]);

  const handleLogin = () => {
    const authWindow = window.open(DISCORD_AUTH_URL, '_blank', 'width=600,height=800');
    authWindow.focus();
  };

  useEffect(() => {
    const handleRedirect = async () => {
      const code = new URLSearchParams(window.location.search).get('code');
      console.log('react有拿到code嗎?', code);
      // const response = await axios.post('http://localhost:8080/api/oauth2/token', {
      //   code,
      //   client_id: CLIENT_ID,
      //   redirect_uri: REDIRECT_URI,
      //   grant_type: 'authorization_code',
      // });
      // const accessToken = response.data.access_token;
      // const userResponse = await axios.get('https://discord.com/api/users/@me', {
      //   headers: {
      //     authorization: `Bearer ${accessToken}`,
      //   },
      // });
      // setAccessToken(accessToken);
      // setUser(userResponse.data);

      // console.log(accessToken, userResponse.data);
    };
    handleRedirect();
  }, []);

  return (
    <>
      {accessToken ? (
        <div>
          <h2>Logged in as {user.username}</h2>
          <img
            src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
            alt="Discord avatar"
          />
        </div>
      ) : (
        <button onClick={handleLogin}>Login with Discord</button>
      )}
      <Routes>
        <Route
          exact
          path="/oauth2/redirect/*"
          render={() => {
            handleRedirect();
            return <Redirect to="/" />;
          }}
        />
      </Routes>
    </>
  );
};

export default Home;
