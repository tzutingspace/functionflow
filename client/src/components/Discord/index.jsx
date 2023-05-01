import styled from 'styled-components/macro';
import { useState, useCallback } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthContext } from '../../contexts/authContext';
import api from '../../utils/api';

import discordLogo from './discord-logo.png';

// const CLIENT_ID = '1091689250522681374'; old
const CLIENT_ID = process.env.REACT_APP_DISCORD_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_DISCORD_REDIRECT_URI;
const SCOPE = process.env.REACT_APP_DISCORD_SCOPE;
const DISCORD_AUTH_URL = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&permissions=2048&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-height: 60px;
  border: 0px;
  padding-bottom: 0px;
  margin-bottom: 0px;
  justify-content: center;
`;

const Placeholder = styled.span`
  padding-left: 6px;
  opacity: 0.5;
  border: 0px;
`;

const DiscodLogo = styled.img`
  height: 14px;
  min-height: 14px;
  width: 14px;
  min-width: 14px;
  border: 0px;
`;

const OAuthButton = styled.button`
  display: flex;
  align-items: center;
  width: 250px;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 38px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  /* border-color: grey; */
`;

const Discord = ({ item, setInput }) => {
  // const [channelId, setChannelId] = useState('');
  const [getChannel, setChannel] = useState(false);

  // 點擊授權按鈕
  const handleAuthorizeClick = () => {
    const width = 500;
    const height = 660;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    // 設定彈跳視窗的設定
    const popup = window.open(
      `${DISCORD_AUTH_URL}`, // 填入你的後端 OAuth2 授權網址
      '_blank',
      `width=${width},height=${height},top=${top}, left=${left}`
    );
    // 添加事件監聽器以監聽message事件
    window.addEventListener('message', handlePopupMessage, false);
  };

  // handleResponse
  const handleDiscordResponse = useCallback(async (code) => {
    const systemChannelId = await api.getDiscordChannel(code);
    // setChannelId(systemChannelId);
    let newObj = {};
    console.log(item);
    newObj[item.name] = systemChannelId;
    setInput((prev) => {
      return { ...prev, ...newObj };
    });
    setChannel(true);
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
      {getChannel ? (
        <></>
      ) : (
        <Wrapper>
          <OAuthButton onClick={handleAuthorizeClick}>
            <DiscodLogo src={discordLogo}></DiscodLogo>
            <Placeholder>Connect a Discord Account</Placeholder>
          </OAuthButton>
        </Wrapper>
      )}
    </>
  );
};

export default Discord;
