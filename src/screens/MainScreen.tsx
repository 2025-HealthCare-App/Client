import React, {useEffect} from 'react';
import styled from 'styled-components/native';
import UserBar from '../components/mainScreen/UserBar';
import StyledTextTicker from '../components/mainScreen/StyledTextTicker';
import MainContents from '../components/mainScreen/MainContents';
import BottomBar from '../components/common/BottomBar';
import {getMyWeekGoalAPI} from '../apis/week-ex/weekExApi';

const MainScreen = () => {
  useEffect(() => {
    getMyWeekGoalAPI()
      .then(response => {
        console.log(response);
        const data = response.data;
        if (data === null) {
          console.log('이번주 목표가 설정되지 않았습니다.');
          return;
        }
        console.log('이번주 목표:', data.target_distance, 'm');
        console.log('이번주 달린 거리:', data.total_distance, 'm');
      })
      .catch(error => {
        console.error('이번주 목표 조회 실패:', error);
      });
  }, []);

  return (
    <Wrapper>
      <UserBar />
      <StyledTextTicker text="이번주 목표를 달성할 수 있을까요? 오늘도 함께 달려요!  이번주 목표를 달성할 수 있을까요? 오늘도 함께 달려요!" />
      <MainContents />
      <BottomBar />
    </Wrapper>
  );
};

export default MainScreen;

const Wrapper = styled.View`
  height: 100%;
  justify-content: flex-start;
  align-items: center;
  background-color: #222831;
  padding-bottom: 70px; /* bottomBar 높이만큼 여백 추가 */
  padding-top: 20px;
  gap: 15px;
`;
