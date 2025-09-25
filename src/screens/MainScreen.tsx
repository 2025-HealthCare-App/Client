import React from 'react';
import styled from 'styled-components/native';
import UserBar from '../components/mainScreen/UserBar';
import StyledTextTicker from '../components/mainScreen/StyledTextTicker';
import MainContents from '../components/mainScreen/MainContents';
import useWeeklyRewardAlert from '../hooks/useWeeklyRewardAlert';
import {Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const MainScreen = () => {
  useWeeklyRewardAlert();
  const navigation = useNavigation<any>();

  return (
    <Wrapper>
      <Button
        title="Pedometer 테스트 화면으로"
        onPress={() => navigation.navigate('PedometerTest')}
      />
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
