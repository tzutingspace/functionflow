import { useEffect } from 'react';

const Oauth2 = () => {
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (!code) {
      window.opener.postMessage({ type: 'error' });
    } else {
      const message = { type: 'discord:auth', payload: code };
      window.opener.postMessage(message);
      window.close();
    }
  });
  return <div>Oauth2...ing</div>;
};

export default Oauth2;
