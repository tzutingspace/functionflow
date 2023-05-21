import dotenv from 'dotenv';
import axios from 'axios';
import qs from 'qs';

import pool from '../utils/db.js';
import * as DBAppAccount from '../models/appAccount.js';

dotenv.config();

const { DISCORD_CLIENT_ID, DISCORD_OAUTH_SECRET, DISCORD_REDIRECT_URI } =
  process.env;

export const OAuth = async (req, res) => {
  console.debug('@controller OAuth', req.query);
  const { code } = req.query;
  const url = 'https://discord.com/api/v10/oauth2/token';

  const data = qs.stringify({
    client_id: DISCORD_CLIENT_ID,
    client_secret: DISCORD_OAUTH_SECRET,
    code,
    grant_type: 'authorization_code',
    redirect_uri: DISCORD_REDIRECT_URI,
  });

  const options = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  const response = await axios.post(url, data, options);
  const { guild } = response.data;
  const systemChannelId = guild.system_channel_id;

  // 向 Discord API 發送 GET 請求以獲取已授權用戶的資訊, 更新於資料庫
  const accessToken = response.data.access_token;
  // const refreshToken = response.data.refresh_token;
  const userResponse = await axios.get('https://discord.com/api/users/@me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const conn = await pool.getConnection();
  try {
    await conn.query('START TRANSACTION');
    const appInfo = {
      userId: req.user.id,
      appName: 'Discord',
      appIdentity: userResponse.data.email,
      appInformation: response.data.scope,
    };

    const appAccountData = await DBAppAccount.searchAppAccount(appInfo, conn);
    if (appAccountData) {
      appInfo.id = appAccountData.id;
      await DBAppAccount.updateAppAccount(appInfo, conn);
    } else {
      await DBAppAccount.insertAppAccount(appInfo, conn);
    }
    await conn.query('COMMIT');
  } catch (error) {
    await conn.query('ROLLBACK');
    console.error('Error occurred during add app information to DB', error);
  } finally {
    conn.release();
  }

  return res.json({ data: { systemChannelId } });
};
