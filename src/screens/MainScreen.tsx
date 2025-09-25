import React from 'react';
import styled from 'styled-components/native';
import UserBar from '../components/mainScreen/UserBar';
import StyledTextTicker from '../components/mainScreen/StyledTextTicker';
import MainContents from '../components/mainScreen/MainContents';
import useWeeklyRewardAlert from '../hooks/useWeeklyRewardAlert';

const MainScreen = () => {
  useWeeklyRewardAlert();

  return (
    <Wrapper>
      <UserBar />
      <StyledTextTicker text="이번주 목표를 달성할 수 있을까요? 오늘도 함께 달려요!  이번주 목표를 달성할 수 있을까요? 오늘도 함께 달려요!" />
      <MainContents />
    </Wrapper>
  );
};

export default MainScreen;

const Wrapper = styled.View`
  height: 100%;
  justify-content: flex-start;
  align-items: center;
  background-color: #222831;
  padding-top: 20px;
  gap: 15px;
`;
