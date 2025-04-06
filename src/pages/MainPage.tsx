import React from 'react';
import {Text} from 'react-native';
import styled from 'styled-components/native'; // ← RN은 반드시 /native 필요!

const MainPage = () => {
  return (
    <Wrapper>
      <Text>안녕하세요</Text>
      <UserInfoBar />
    </Wrapper>
  );
};

export default MainPage;

const Wrapper = styled.View`
  height: 100vh;
  width: 100%;
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
`;

const UserInfoBar = styled.View`
  width: 100%;
  height: 50px;
  justify-content: center;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: #00adb5;
  padding: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
