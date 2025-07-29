import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import BottomBar from '../components/common/BottomBar';
import CharacterComment from '../components/StatisticsScreen/CharacterComment';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {getMyRecentExercisesAPI} from '../apis/exercise/exerciseAPI';
import {ExerciseType, toExerciseType} from '../types/exerciseType';
import Exercise from '../components/StatisticsScreen/Exercise';
import {
  getMyWeekAvgDistanceAPI,
  getWeekAvgDistanceAPI,
} from '../apis/week-ex/weekExApi';
import dayjs from 'dayjs';

type weeklyDataType = {
  day: string;
  myDistance: number;
  avgDistance: number;
};
export const mapWeeklyData = (
  myDistances: {[date: string]: number},
  avgDistances: {[date: string]: number},
): weeklyDataType[] => {
  // 날짜 오름차순 정렬
  const sortedDates = Object.keys(myDistances).sort();

  return sortedDates.map(date => ({
    day: dayjs(date).format('ddd'), // 예: "Mon", "Tue"
    myDistance: myDistances[date] || 0,
    avgDistance: avgDistances[date] || 0,
  }));
};

const StatisticsScreen = () => {
  const [recentExercises, setRecentExercises] = useState<ExerciseType[]>([]);
  const [weeklyData, setWeeklyData] = useState<weeklyDataType[]>([]);
  const [maxDistance, setMaxDistance] = useState<number>(100);
  const navigation = useNavigation();

  //1. 나의 운동 받아오기(매번 StatisticsScreen이 포커스될 때마다)
  useFocusEffect(
    React.useCallback(() => {
      getMyRecentExercisesAPI()
        .then(response => {
          const {exercises} = response.data;
          console.log('나의 운동 데이터:', JSON.stringify(exercises, null, 2));
          // 프론트에서 최근순으로 정렬
          exercises.sort(
            (a: any, b: any) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          );
          if (Array.isArray(exercises)) {
            setRecentExercises(exercises.map(toExerciseType));
          }
        })
        .catch(error => {
          console.error('나의 운동 데이터 가져오기 실패:', error);
        });
    }, []),
  );

  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        const [avgRes, myRes] = await Promise.all([
          getWeekAvgDistanceAPI(),
          getMyWeekAvgDistanceAPI(),
        ]);

        const mapped = mapWeeklyData(
          myRes.myWeeklyDistances,
          avgRes.weeklyAverages,
        );
        setWeeklyData(mapped);

        // ✅ 최대 거리 계산
        const max = Math.max(
          ...mapped.map(item => Math.max(item.myDistance, item.avgDistance)),
        );
        setMaxDistance(max === 0 ? 1 : max); // 0일 경우 대비
      } catch (err) {
        console.error('주간 평균 거리 데이터 조회 실패:', err);
      }
    };

    fetchWeeklyData();
  }, []);

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
                        height={(data.avgDistance / maxDistance) * 100}
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
              <Exercise key={index} {...exercise} />
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
  min-height: 0px;
`;

const DayLabel = styled.Text`
  font-size: 12px;
  color: #ffffff;
  position: absolute;
  bottom: -20px; /* 0km 선 아래에 위치 */
`;
