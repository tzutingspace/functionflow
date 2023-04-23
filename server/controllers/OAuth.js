import dotenv from 'dotenv';
import axios from 'axios';
import qs from 'qs';

dotenv.config();

const { DISCORD_CLIENT_ID, DISCORD_OAUTH_SECRET, DISCORD_REDIRECT_URI } =
  process.env;

export const OAuth = async (req, res) => {
  console.log('@controller OAuth');
  console.log('@OAuth query', req.query);

  console.log(DISCORD_CLIENT_ID, DISCORD_OAUTH_SECRET, DISCORD_REDIRECT_URI);
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
  // const accessToken = response.data.access_token;
  // const refreshToken = response.data.refresh_token;
  const { guild } = response.data;
  const systemChannelId = guild.system_channel_id;
  return res.json({ data: { systemChannelId } });
  // 向 Discord API 發送 GET 請求以獲取已授權用戶的資訊
  // 暫時用不到
  // const userResponse = await axios.get('https://discord.com/api/users/@me', {
  //   headers: {
  //     Authorization: `Bearer ${accessToken}`,
  //   },
  // });
  // const users = userResponse.data;
  // return res.json({ data: { systemChannelId } });
};
