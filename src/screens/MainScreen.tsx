import React from 'react';
import styled from 'styled-components/native';
import UserBar from '../components/mainScreen/UserBar';
import StyledTextTicker from '../components/mainScreen/StyledTextTicker';
import MainContents from '../components/mainScreen/MainContents';
import BottomBar from '../components/common/BottomBar';

const MainScreen = ({navigation}: {navigation: any}) => {
  return (
    <Wrapper>
      <UserBar />
      <StyledTextTicker />
      <MainContents />
      <BottomBar />
    </Wrapper>
  );
};

export default MainScreen;

const Wrapper = styled.View`
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  background-color: #222831;
  padding: 30px 0;
  gap: 15px;
`;
