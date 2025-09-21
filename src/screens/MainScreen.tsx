import React, {useEffect} from 'react';
import styled from 'styled-components/native';
import UserBar from '../components/mainScreen/UserBar';
import StyledTextTicker from '../components/mainScreen/StyledTextTicker';
import MainContents from '../components/mainScreen/MainContents';
import useWeeklyRewardAlert from '../hooks/useWeeklyRewardAlert';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MainScreen = () => {
  useWeeklyRewardAlert();
  // useEffect(() => {
  //   const clearRewardWeek = async () => {
  //     await AsyncStorage.removeItem('lastRewardAlertWeek');
  //     console.log('lastRewardAlertWeek 삭제 완료');
  //   };

  //   clearRewardWeek(); // 앱 실행 시 바로 삭제
  // }, []);

  return (
    <Wrapper>
      <UserBar />
      <StyledTextTicker text="이번주 목표를 달성할 수 있을까요? 오늘도 함께 달려요!  이번주 목표를 달성할 수 있을까요? 오늘도 함께 달려요!" />
      <MainContents />
    </Wrapper>
  );
};

export default MainScreen;

// const Wrapper = styled.View`
//   flex: 1; /* height: 100% 대신 flex: 1 */
//   justify-content: flex-start;
//   align-items: center;
//   background-color: #222831;
//   padding-top: 20px;
//   gap: 15px;
// `;

const Wrapper = styled.View`
  height: 100%;
  justify-content: flex-start;
  align-items: center;
  background-color: #222831;
  padding-top: 20px;
  gap: 15px;
`;
