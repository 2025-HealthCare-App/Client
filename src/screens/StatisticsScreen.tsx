import React, {useEffect} from 'react';
import styled from 'styled-components/native';
import BottomBar from '../components/common/BottomBar';
import CharacterComment from '../components/StatisticsScreen/CharacterComment';
import Activity from '../components/StatisticsScreen/Activity';
import {useNavigation} from '@react-navigation/native';
import {getMyExercisesAPI} from '../apis/exercise/exerciseAPI';

const StatisticsScreen = () => {
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

  const maxDistance = 7; // 최대 거리 (7km)

  // console.log('월요일 goalDistance:', weeklyData[0].goalDistance);
  // console.log('계산된 높이:', (weeklyData[0].goalDistance / maxDistance) * 100);

  //나의 운동 받아오기
  useEffect(() => {
    getMyExercisesAPI()
      .then(response => {
        // console.log('나의 운동 데이터:', response.data);
      })
      .catch(error => {
        console.error('나의 운동 데이터 가져오기 실패:', error);
      });
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
            <Activity
              distance={3934}
              steps={234}
              elapsedSec={2340}
              Kcal={151}
              startTime="2023.10.01 13:22"
              activityTitle="CAUON - 제 2회 정기 러닝"
              points={142}
            />
            <Activity
              distance={1039}
              steps={1454}
              elapsedSec={1230}
              Kcal={151}
              startTime="2024.05.17 19:29"
              activityTitle="혼자 뛰기"
              points={39}
            />
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
