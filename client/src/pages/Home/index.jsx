import styled from 'styled-components';
import { useState, useEffect, useContext, useCallback } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthContext } from '../../contexts/authContext';
import api from '../../utils/api';

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

// const CLIENT_ID = '1091689250522681374'; old
const CLIENT_ID = '1099302704767045772';
const REDIRECT_URI = 'http://localhost:3000/oauth2/redirect';
const SCOPE = 'identify email bot';
const DISCORD_AUTH_URL = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&permissions=2048&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}`;

const Home = () => {
  const [channelId, setChannelId] = useState('');

  // 點擊授權按鈕
  const handleAuthorizeClick = () => {
    // 設定彈跳視窗的設定
    const popup = window.open(
      `${DISCORD_AUTH_URL}`, // 填入你的後端 OAuth2 授權網址
      '_blank',
      'width=500,height=600'
    );
    // 添加事件監聽器以監聽message事件
    window.addEventListener('message', handlePopupMessage, false);
  };

  // handleResponse
  const handleDiscordResponse = useCallback(async (code) => {
    const systemChannelId = await api.getDiscordChannel(code);
    setChannelId(systemChannelId);
    return systemChannelId;
  }, []);

  // 彈跳視窗的事件監聽
  const handlePopupMessage = (event) => {
    // 確認訊息是從正確的網址傳來的
    if (event.origin !== window.location.origin) return;
    const { type, payload } = event.data;
    console.log('彈出視窗回傳的type and payload', type, payload);
    if (type === 'discord:auth') {
      window.removeEventListener('message', handlePopupMessage, false);
      // 送訊息給後端
      handleDiscordResponse(payload);
    }
  };

  return (
    <>
      <button onClick={handleAuthorizeClick}>Login with Discord</button>
      <p>{channelId}</p>
    </>
  );
};

export default Home;
