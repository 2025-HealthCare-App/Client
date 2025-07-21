import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import BottomBar from '../components/common/BottomBar';
import CharacterComment from '../components/StatisticsScreen/CharacterComment';
import Activity from '../components/StatisticsScreen/Activity';
import {useNavigation} from '@react-navigation/native';
import {getMyRecentExercisesAPI} from '../apis/exercise/exerciseAPI';

type Exercise = {
  exerciseId: number;
  distance: number;
  steps: number;
  elapsedSec: number;
  Kcal: number;
  startTime: string;
  endTime: string;
  exTitle: string;
  points: number;
  staticMapUrl: string;
  date: string;
};

const StatisticsScreen = () => {
  const [recentExercises, setRecentExercises] = useState<Exercise[]>([]);
  const navigation = useNavigation();

  // 주간 데이터 (월~일) - //TODO(임시)
  const weeklyData = [
    {day: '월', myDistance: 4.5, goalDistance: 7.0},
    {day: '화', myDistance: 2.0, goalDistance: 3.5},
    {day: '수', myDistance: 3.2, goalDistance: 2.8},
    {day: '목', myDistance: 6.5, goalDistance: 4.2},
    {day: '금', myDistance: 4.8, goalDistance: 4.0},
    {day: '토', myDistance: 5.2, goalDistance: 6.0},
    {day: '일', myDistance: 2.5, goalDistance: 3.5},
  ];
  const maxDistance = 7; // 최대 거리 (7km) - //TODO(임시)

  // 경과 시간 계산 함수(startTime과 endTime을 초로 변환)
  const getElapsedSec = (start: string, end: string): number => {
    const [sh, sm, ss] = start.split(':').map(Number);
    const [eh, em, es] = end.split(':').map(Number);
    const startSec = sh * 3600 + sm * 60 + ss;
    const endSec = eh * 3600 + em * 60 + es;
    return endSec - startSec;
  };
  //created_at에서 날짜 추출 함수
  const getDateFromCreatedAt = (createdAt: string): string => {
    const date = new Date(createdAt);
    return date.toISOString().split('T')[0]; // 'YYYY-MM-DD' 형식으로 반환
  };

  //나의 운동 받아오기
  useEffect(() => {
    getMyRecentExercisesAPI()
      .then(response => {
        // console.log('나의 최근 운동 데이터:', response.data);
        const {exercises} = response.data;
        if (Array.isArray(exercises)) {
          setRecentExercises(
            exercises.map((exercise: any) => ({
              exerciseId: exercise.exercise_id,
              distance: exercise.ex_distance,
              steps: exercise.ex_steps,
              elapsedSec: getElapsedSec(
                exercise.ex_start_time,
                exercise.ex_end_time,
              ),
              Kcal: exercise.ex_kcal,
              startTime: exercise.ex_start_time,
              endTime: exercise.ex_end_time,
              exTitle: exercise.ex_title || '오늘의 운동',
              points: exercise.points || 0,
              staticMapUrl: exercise.ex_route_image || '',
              date: getDateFromCreatedAt(exercise.created_at), // 날짜 추출
            })),
          );
        }
      })
      .catch(error => {
        console.error('나의 운동 데이터 가져오기 실패:', error);
      });
  }, []);

  //잘 세팅되었나 확인
  useEffect(() => {
    console.log(JSON.stringify(recentExercises, null, 2)); // JSON 형태로 출력
  }, [recentExercises]);

  return (
    <Wrapper>
      <Header>
        <Title>나의 운동</Title>
      </Header>
      <Main showsVerticalScrollIndicator={false}>
        <CharacterComment />
        <Section id="graph">
          <GraphHeader>
            <SemiTitle>주간 그래프</SemiTitle>
            <LegendContainer>
              <Legend>
                <LegendDot color="#E91E63" />
                <LegendText>나의 기록</LegendText>
              </Legend>
              <Legend>
                <LegendDot color="#CDDC39" />
                <LegendText>사용자 평균 기록</LegendText>
              </Legend>
            </LegendContainer>
          </GraphHeader>
          <GraphContainer>
            <YAxisContainer>
              <YAxisLabel>7km</YAxisLabel>
              <YAxisLabel>5km</YAxisLabel>
              <YAxisLabel>3km</YAxisLabel>
              <YAxisLabel>0km</YAxisLabel>
            </YAxisContainer>
            <ChartArea>
              <GridLines>
                <GridLine />
                <GridLine />
                <GridLine />
                <GridLine />
              </GridLines>
              <BarsContainer>
                {weeklyData.map((data, index) => (
                  <BarGroup key={index}>
                    <BarsWrapper>
                      <Bar
                        height={(data.myDistance / maxDistance) * 100}
                        color="#E91E63"
                      />
                      <Bar
                        height={(data.goalDistance / maxDistance) * 100}
                        color="#CDDC39"
                      />
                    </BarsWrapper>
                    <DayLabel>{data.day}</DayLabel>
                  </BarGroup>
                ))}
              </BarsContainer>
            </ChartArea>
          </GraphContainer>
        </Section>
        <Section id="activities">
          <SemiTitle>최근 활동</SemiTitle>
          <ActivitiesContainer>
            {recentExercises.map((exercise, index) => (
              <Activity
                key={index}
                distance={exercise.distance}
                steps={exercise.steps}
                elapsedSec={exercise.elapsedSec}
                Kcal={exercise.Kcal}
                startTime={exercise.startTime}
                exTitle={exercise.exTitle}
                points={exercise.points}
              />
            ))}
          </ActivitiesContainer>
          <PlusButton onPress={() => navigation.navigate('Activities')}>
            <PlusButtonText>더보기</PlusButtonText>
          </PlusButton>
        </Section>
      </Main>
      <BottomBar />
    </Wrapper>
  );
};

export default StatisticsScreen;

const Wrapper = styled.View`
  width: 100%;
  height: 100%;
  justify-content: space-between;
  align-items: center;
  background-color: #222831;
  padding-bottom: 60px;
`;

const Header = styled.View`
  width: 90%;
  height: 10%;
  justify-content: center;
  align-items: flex-start;
`;

const Title = styled.Text`
  font-size: 20px;
  color: #ffffff;
  font-weight: bold;
`;

const Main = styled.ScrollView`
  width: 95%;
  height: 90%;
  padding: 30px 20px;
  background-color: #393e46;
  border-radius: 18px;
`;

const Section = styled.View`
  width: 100%;
  margin-bottom: 40px;
  gap: 15px;
`;

const GraphHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const SemiTitle = styled.Text`
  font-size: 15px;
  color: #ffffff;
  font-weight: bold;
`;

const LegendContainer = styled.View`
  flex-direction: row;
  gap: 15px;
`;

const Legend = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 5px;
`;

interface LegendDotProps {
  color: string;
}
const LegendDot = styled.View<LegendDotProps>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${props => props.color};
`;

const LegendText = styled.Text`
  font-size: 10px;
  color: #ffffff;
`;

const GraphContainer = styled.View`
  width: 100%;
  height: 200px;
  flex-direction: row;
`;

const YAxisContainer = styled.View`
  width: 40px;
  height: 100%;
  justify-content: space-between;
  align-items: flex-end;
  padding-right: 8px;
`;

const YAxisLabel = styled.Text`
  font-size: 10px;
  color: #687b97;
`;

const ChartArea = styled.View`
  flex: 1;
  height: 200px;
  position: relative;
`;

const GridLines = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  justify-content: space-between;
`;

const GridLine = styled.View`
  width: 100%;
  height: 0.5px;
  background-color: #687b97;
`;

const ActivitiesContainer = styled.View`
  width: 100%;
`;

const PlusButton = styled.TouchableOpacity`
  width: 100%;
  height: 40px;
  background-color: #858585;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
`;

const PlusButtonText = styled.Text`
  font-size: 13px;
  color: #ffffff;
  text-align: center;
`;

const BarsContainer = styled.View`
  flex-direction: row;
  height: 100%;
  justify-content: space-between;
  align-items: flex-end;
  padding-bottom: 0px; /* 기존 20px에서 0px로 변경 */
`;

const BarGroup = styled.View`
  align-items: center;
  flex: 1;
  height: 100%;
  justify-content: flex-end; /* 추가: 막대를 바닥에 붙임 */
`;

const BarsWrapper = styled.View`
  flex-direction: row;
  align-items: flex-end;
  gap: 2px;
`;

interface BarProps {
  height: number;
  color: string;
}
const Bar = styled.View<BarProps>`
  width: 12px;
  height: ${props => (props.height / 100) * 200}px;
  background-color: ${props => props.color};
  border-radius: 2px;
  min-height: 4px;
`;

const DayLabel = styled.Text`
  font-size: 12px;
  color: #ffffff;
  position: absolute;
  bottom: -20px; /* 0km 선 아래에 위치 */
`;
