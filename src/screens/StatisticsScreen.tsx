import React from 'react';
import styled from 'styled-components/native';
import BottomBar from '../components/common/BottomBar';
import SpeechBubble from '../components/StatisticsScreen/SpeechBubble';
import {Image} from 'react-native';

const StatisticsScreen = ({navigation}: {navigation: any}) => {
  return (
    <Wrapper>
      <Header>
        <Title>나의 운동</Title>
      </Header>
      <Main>
        <CharacterCommentContainer>
          <CharacterAndKm>
            <CharacterImg
              source={require('../images/characters/character1.png')}
            />
            <KmText>5km</KmText>
          </CharacterAndKm>
          <SpeechBubble />
        </CharacterCommentContainer>
      </Main>
      <BottomBar />
    </Wrapper>
  );
};

export default StatisticsScreen;

const Wrapper = styled.View`
  height: 100%;
  justify-content: flex-start;
  align-items: center;
  background-color: #222831;
  padding: 0px 20px;
  padding-bottom: 70px; /* bottomBar 높이만큼 여백 추가 */
  /* gap: 5px; */
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
  padding: 0px 20px;
  background-color: #393e46;
  height: 90%;
  border-radius: 18px;
  padding-top: 30px;
`;

const CharacterCommentContainer = styled.View`
  width: 100%;
  height: 70px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

const CharacterAndKm = styled.View`
  width: 50px;
  height: 100%;
  justify-content: space-between;
  align-items: center;
`;
const CharacterImg = styled(Image)`
  width: 55px;
  height: 55px;
`;
const KmText = styled.Text`
  font-size: 12px;
  color: #ffffff;
  font-weight: bold;
  text-align: center;
`;
