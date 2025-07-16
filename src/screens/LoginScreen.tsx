import React from 'react';
import {Button} from 'react-native';
import styled from 'styled-components/native'; // ← RN은 반드시 /native 필요!

const LoginScreen = ({navigation}: {navigation: any}) => {
  return (
    <Wrapper>
      <Title>달려</Title>
      <LoginWrapper>
        <Row>
          <RowText>로그인</RowText>
          <Input />
        </Row>
        <Row>
          <RowText>비밀번호</RowText>
          <Input secureTextEntry={true} />
        </Row>
      </LoginWrapper>
    </Wrapper>
  );
};

export default LoginScreen;

const Wrapper = styled.View`
  height: 100%;
  justify-content: flex-start;
  align-items: center;
  background-color: #222831;
  padding-bottom: 70px; /* bottomBar 높이만큼 여백 추가 */
  padding-top: 20px;
  gap: 15px;
`;

const LoginWrapper = styled.View`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const Title = styled.Text`
  color: #ffffff;
  font-size: 30px;
  font-weight: bold;
`;

const Row = styled.View`
  width: 80%;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

const RowText = styled.Text`
  color: #ffffff;
  font-size: 15px;
  width: 30%;
`;

const Input = styled.TextInput`
  width: 70%;
  height: 40px;
  background-color: #393e46;
  border-radius: 5px;
  padding: 10px;
  color: #ffffff;
`;
