import styled from 'styled-components';

const Wrapper = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: #313538;
`;

const Content = styled.div`
  max-width: 1200px;
  height: 115px;
  padding-left: 24px;
  padding-right: 20px;
  margin: 0 auto;
  display: flex;
  align-items: center;
`;

const Copywright = styled.div`
  margin-left: 30px;
  line-height: 17px;
  font-size: 12px;
  color: #828282;
`;

function Footer() {
  return (
    <Wrapper>
      <Content>
        <Copywright>© 2022. All rights reserved.</Copywright>
      </Content>
    </Wrapper>
  );
}

// export default Footer;
