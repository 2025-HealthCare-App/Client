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
  height: 100%;
  justify-content: space-between;
  align-items: center;
  background-color: #222831;
  padding: 0px 20px;
  padding-bottom: 70px; /* bottomBar 높이만큼 여백 추가 */
  padding-top: 20px;
  gap: 15px;
`;
