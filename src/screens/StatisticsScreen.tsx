import React from 'react';
import styled from 'styled-components/native';
import BottomBar from '../components/common/BottomBar';
import CharacterComment from '../components/StatisticsScreen/CharacterComment';
import Activity from '../components/StatisticsScreen/Activity';

const StatisticsScreen = ({navigation}: {navigation: any}) => {
  return (
    <Wrapper>
      <Header>
        <Title>나의 운동</Title>
      </Header>
      <Main>
        <CharacterComment />
        <Section id="graph">
          <SemiTitle>주간 그래프</SemiTitle>
          <GraphContainer>
            <Line />
            <Line />
            <Line />
            <Line />
          </GraphContainer>
        </Section>
        <Section id="activities">
          <SemiTitle>최근 활동</SemiTitle>
          <ActivitiesContainer>
            <Activity />
            <Activity />
            <Activity />
            <Activity />
          </ActivitiesContainer>
          <PlusButton onPress={() => navigation.navigate('Activity')}>
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
  height: 100%;
  justify-content: space-between;
  align-items: center;
  background-color: #222831;
  padding: 0px 20px;
  padding-bottom: 60px; /* bottomBar 높이만큼 여백 추가 */
`;

const Header = styled.View`
  width: 100%;
  height: 10%;
  /* background-color: #787878; */
  justify-content: center;
  align-items: flex-start;
`;
const Title = styled.Text`
  font-size: 20px;
  color: #ffffff;
  font-weight: bold;
`;

const Main = styled.ScrollView`
  width: 100%;
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
const SemiTitle = styled.Text`
  font-size: 15px;
  color: #ffffff;
  font-weight: bold;
`;

const GraphContainer = styled.View`
  width: 100%;
  height: 200px;
  justify-content: space-between;
`;
const Line = styled.View`
  width: 100%;
  height: 0.7px;
  background-color: #687b97;
`;

const ActivitiesContainer = styled.View`
  width: 100%;
  gap: 15px;
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
