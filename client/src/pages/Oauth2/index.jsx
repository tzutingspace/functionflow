import { useEffect } from 'react';

const Oauth2 = () => {
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (!code) {
      console.log('取得 Discord Code Error');
      window.opener.postMessage('Error');
    } else {
      console.log(`Discord OAuth2 Code: ${code}`);
      const message = { type: 'discord:auth', payload: code };
      window.opener.postMessage(message);
      window.close();
    }
  });
  return <div>Oauth2...ing</div>;
};

export default Oauth2;
