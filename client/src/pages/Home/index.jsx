import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';
import mainImage from './mainimage.png';

import HomeHead from './Header';
import Login from './Login';
import Signup from './Signup';

import { AuthContext } from '../../contexts/authContext';

// 頁面全局樣式
const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

// 主區塊
const Main = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 2048px;
  margin: 0;
  padding: 0;
  height: 100%;

  overflow: hidden;
`;

// 左側區塊
const LeftArea = styled.div`
  flex: 1;
  display: flex;
  margin: auto;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #f9f9f9;
`;

const LeftInnerBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0;
  width: 60%;
  /* max-width: 320px; */
  padding: 10px 20px 50px 20px;
  border: 1px solid #e6e6e6;
  border-radius: 10px;
`;

// 右側區塊
const RightArea = styled.div`
  flex: 2;
  display: flex;
  margin: auto;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
  height: 100%;
`;

const DescriptionImage = styled.div`
  background-size: cover;
  background-position: center;
  background-image: url(${mainImage});
  width: 100%;
  height: 600px;
`;

// Form Content
const FormContent = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 10px;
  position: relative;
`;

const Home = () => {
  const [defaultForm, setDefaultForm] = useState('login');
  const { setErrorMessage, isLogin } = useContext(AuthContext);

  const navigate = useNavigate();

  const handlerFormSwitch = (form) => {
    setErrorMessage('');
    setDefaultForm(form);
  };

  // 已登入過的用戶進行跳轉
  useEffect(() => {
    if (isLogin) return navigate('/workflows');
  }, [isLogin]);

  return (
    <Wrapper>
      <HomeHead />
      <Main>
        <LeftArea>
          <LeftInnerBlock>
            <FormContent>
              {defaultForm === 'login' ? (
                <Login onFormSwitch={handlerFormSwitch} />
              ) : (
                <Signup onFormSwitch={handlerFormSwitch} />
              )}
            </FormContent>
          </LeftInnerBlock>
        </LeftArea>
        <RightArea>
          <DescriptionImage></DescriptionImage>
        </RightArea>
      </Main>
    </Wrapper>
  );
};

export default Home;
