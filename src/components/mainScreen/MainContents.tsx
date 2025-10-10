import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {Alert, Image, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import GoalModal from './GoalModal';
import {getMyWeekGoalAPI} from '../../apis/week-ex/weekExApi';
import {userInfoAtom} from '../../recoil/atom';
import {useRecoilValue} from 'recoil';
import {getCharacterImageSource} from '../../utils/characterUtil';

const MainContents = () => {
  const navigation = useNavigation();
  const userInfo = useRecoilValue(userInfoAtom);
  const [modalVisible, setModalVisible] = useState(false);
  const [isGoalSet, setIsGoalSet] = useState(false);
  const [weekGoal, setWeekGoal] = useState(0); // 주간 목표 거리 (단위: m)
  const [currentDistance, setCurrentDistance] = useState(0); // 현재 달린 거리 (단위: m)

  const fetchWeekGoal = useCallback(() => {
    getMyWeekGoalAPI()
      .then(response => {
        const data = response.data;
        // console.log('이번주 목표 조회 성공:', data);
        if (data === null) {
          console.log('이번주 목표가 설정되지 않았습니다.');
          setIsGoalSet(false);
          return;
        }

        setIsGoalSet(true);
        setWeekGoal(data.target_distance); // m 단위로 저장
        setCurrentDistance(data.total_distance); // m 단위 그대로 저장
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

  const handleStartBtnPress = () => {
    if (!isGoalSet) {
      Alert.alert(
        '목표 설정',
        '이번주 목표를 설정해주세요.',
        [
          {
            text: '확인',
            onPress: () => setModalVisible(true),
          },
        ],
        {cancelable: false},
      );
      // 목표가 설정되지 않았을 때는 Running 화면으로 이동하지 않음
      return;
    }
    navigation.navigate('Running' as never);
  };

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
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <EditBtn>수정</EditBtn>
          </TouchableOpacity>
        </GoalTitle>

        {isGoalSet ? (
          <GoalBarContainer>
            <GoalBar>
              <RealGoalBar progress={getProgressPercentage()} />
            </GoalBar>
            <GoalProgress>
              {/* 화면에 보여줄 때만 km 단위로 변환 */}
              {(currentDistance / 1000).toFixed(2)}km /{' '}
              {(weekGoal / 1000).toFixed(2)}km (
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
          source={getCharacterImageSource(userInfo?.level)}
          style={{width: 260, height: 260}}
        />
      </CharacterContainer>

      <StartButton onPress={handleStartBtnPress}>
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
  background-color: #393939;
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
const EditBtn = styled.Text`
  font-size: 10px;
  color: #0cbd71;
  font-weight: bold;
  text-align: center;
  width: 40px;
  height: 16px;
  background-color: #393939;
  border-radius: 10px;
  border: 1px solid #0cbd71;
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
  background-color: #0cbd71;
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
  background-color: #0cbd71;
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
  background-color: #00f48a;
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
