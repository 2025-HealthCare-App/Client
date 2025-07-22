import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {Image} from 'react-native';
import styled from 'styled-components/native';
import GoalModal from './GoalModal';
import {getMyWeekGoalAPI} from '../../apis/week-ex/weekExApi';
import {convertMetersToKilometers} from '../../utils/distanceUtil';

const MainContents = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [isGoalSet, setIsGoalSet] = useState(false);
  const [weekGoal, setWeekGoal] = useState(0);
  const [currentDistance, setCurrentDistance] = useState(0);

  const fetchWeekGoal = useCallback(() => {
    getMyWeekGoalAPI()
      .then(response => {
        const data = response.data;
        console.log('이번주 목표 조회 성공:', data);
        if (data === null) {
          console.log('이번주 목표가 설정되지 않았습니다.');
          setIsGoalSet(false);
          return;
        }
        // console.log('이번주 목표:', data.target_distance, 'm');
        // console.log('이번주 달린 거리:', data.total_distance, 'm');
        setIsGoalSet(true);
        setWeekGoal(data.target_distance);
        setCurrentDistance(convertMetersToKilometers(data.total_distance));
      })
      .catch(error => {
        console.error('이번주 목표 조회 실패:', error);
      });
  }, []);

  // 🎯 메인 화면이 포커스를 받을 때마다 목표 fetch
  useFocusEffect(
    useCallback(() => {
      fetchWeekGoal();
    }, [fetchWeekGoal]),
  );

  // 목표 달성률 계산
  const getProgressPercentage = () => {
    if (weekGoal === 0) {
      return 0;
    }
    return Math.min((currentDistance / weekGoal) * 100, 100);
  };

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentWeek = Math.ceil(currentDate.getDate() / 7);

  return (
    <Wrapper>
      <GoalModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setGoal={setWeekGoal}
        setIsGoalSet={setIsGoalSet}
      />

      <GoalContainer>
        <GoalTitle>
          <TitleText>
            {currentMonth}월 {currentWeek}주차 목표
          </TitleText>
        </GoalTitle>

        {isGoalSet ? (
          <GoalBarContainer>
            <GoalBar>
              <RealGoalBar progress={getProgressPercentage()} />
            </GoalBar>
            <GoalProgress>
              {currentDistance}km / {weekGoal}km (
              {Math.round(getProgressPercentage())}%)
            </GoalProgress>
          </GoalBarContainer>
        ) : (
          <GoalSetButton onPress={() => setModalVisible(true)}>
            <GoalSetButtonInner>
              <GoalSetText>이번주 목표를 설정하세요! &gt;</GoalSetText>
            </GoalSetButtonInner>
          </GoalSetButton>
        )}
      </GoalContainer>

      <CharacterContainer>
        <Image
          source={require('../../images/characters/character4.png')}
          style={{width: 300, height: 300}}
        />
      </CharacterContainer>

      <StartButton onPress={() => navigation.navigate('Running')}>
        <TextContainer>
          <StartButtonText>START</StartButtonText>
        </TextContainer>
      </StartButton>
    </Wrapper>
  );
};

export default MainContents;

const Wrapper = styled.View`
  width: 95%;
  height: 85%;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: #393e46;
  border-radius: 18px;
  padding: 50px 0;
  font-family: 'Pretendard';
`;

const GoalContainer = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
`;
const GoalTitle = styled.View`
  width: 85%;
  height: 30px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 5px;
`;
const TitleText = styled.Text`
  font-size: 14px;
  color: #ffffff;
  text-align: center;
  font-weight: bold;
`;

const GoalBarContainer = styled.View`
  width: 80%;
  height: 25px;
  border-radius: 20px;
  border: 2px solid white;
`;
const GoalBar = styled.View`
  width: 100%;
  height: 100%;
  background-color: #d9d9d9;
  border-radius: 20px;
`;

// props 타입 정의
interface RealGoalBarProps {
  progress: number;
}
const RealGoalBar = styled.View<RealGoalBarProps>`
  width: ${props => props.progress}%;
  height: 100%;
  background-color: #ff9292;
  border-radius: 20px;
  transition: width 0.3s ease;
`;
const GoalProgress = styled.Text`
  font-size: 12px;
  color: #ffffff;
  font-weight: bold;
`;
const GoalSetButton = styled.TouchableOpacity`
  width: 50%;
  height: 40px;
  background-color: #cdd800;
  border-radius: 50px;
  justify-content: center;
  align-items: center;
  padding: 1px 0;
`;
const GoalSetButtonInner = styled.View`
  width: 100%;
  height: 100%;
  border: 1.5px solid #ffffff;
  border-radius: 50px;
  justify-content: center;
  align-items: center;
`;
const GoalSetText = styled.Text`
  font-size: 11px;
  font-weight: bold;
  text-decoration: underline;
  color: #ffffff;
  text-align: center;
`;

const CharacterContainer = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const StartButton = styled.TouchableOpacity`
  width: 200px;
  height: 60px;
  background-color: #00adb5;
  border: 3px solid #ffffff;
  border-radius: 50px;
  justify-content: center;
  align-items: center;
`;
const TextContainer = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
`;
const StartButtonText = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
  line-height: 20px;
`;
