import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Image} from 'react-native';
import styled from 'styled-components/native';
import GoalModal from './GoalModal';

const MainContents = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false); // 모달 상태
  const [isGoalSet, setIsGoalSet] = useState(false); // 목표 설정 여부 상태
  const [goal, setGoal] = useState(0); // 목표 거리 상태(0~100km)
  const [currentDistance, setCurrentDistance] = useState(25); // 현재 달린 거리 (예시값)

  useEffect(() => {
    console.log('목표 거리:', goal);
  }, [goal]);

  // 목표 달성률 계산 (0~100%)
  const getProgressPercentage = () => {
    if (goal === 0) {
      return 0;
    }
    const percentage = Math.min((currentDistance / goal) * 100, 100);
    return percentage;
  };

  return (
    <Wrapper>
      {/* 모달 */}
      <GoalModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setGoal={setGoal}
        setIsGoalSet={setIsGoalSet}
      />

      <GoalContainer>
        <GoalTitle>
          <TitleText>3월 2주차 목표</TitleText>
          <QuestionMarkWrapper>
            <QuestionMark>?</QuestionMark>
          </QuestionMarkWrapper>
        </GoalTitle>

        {isGoalSet ? (
          <GoalBarContainer>
            <GoalBar>
              <RealGoalBar progress={getProgressPercentage()} />
            </GoalBar>
            <GoalProgress>
              {currentDistance}km / {goal}km (
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
  width: 100%;
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

const QuestionMarkWrapper = styled.View`
  width: 15px;
  height: 15px;
  aspect-ratio: 1/1;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  border: 1px solid #ffffff;
`;
const QuestionMark = styled.Text`
  font-size: 7px;
  color: #ffffff;
  font-weight: bold;
  text-align: center;
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
