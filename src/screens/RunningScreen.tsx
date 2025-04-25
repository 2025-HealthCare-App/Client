import React from 'react';
import {Image} from 'react-native';
import styled from 'styled-components/native';
import RunningButton from '../components/runningScreen/RunningButton';

const RunningScreen = () => {
  return (
    <Wrapper>
      <RecordsContainer>
        <Category>
          <Value>3.93</Value>
          <CategoryText>Km</CategoryText>
        </Category>
        <Category>
          <Value>4,210</Value>
          <CategoryText>Step</CategoryText>
        </Category>
        <Category>
          <Value>210</Value>
          <CategoryText>Kcal</CategoryText>
        </Category>
      </RecordsContainer>
      <Main>
        <TimeContainer>
          <Time>39:03</Time>
          <TimeText>Time</TimeText>
        </TimeContainer>
        <CharacterContainer>
          <Point>+ 142 P</Point>
          <CharacterImage
            source={require('../images/characters/character1.png')}
          />
        </CharacterContainer>
        <ButtonContainer>
          <RunningButton />
        </ButtonContainer>
      </Main>
    </Wrapper>
  );
};

export default RunningScreen;

const Wrapper = styled.View`
  height: 100%;
  width: 100%;
  padding: 50px 25px;
  background-color: #cdd800;
  gap: 20px;
`;

const RecordsContainer = styled.View`
  width: 100%;
  height: 12%;
  flex-direction: row;
  justify-content: space-between;
  background-color: #b6bf00;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
`;
const Category = styled.View`
  width: 33%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;
const Value = styled.Text`
  font-size: 27px;
  color: #171b21;
  font-weight: bold;
  text-align: center;
`;
const CategoryText = styled.Text`
  font-size: 15px;
  color: #171b21;
  text-align: center;
`;

const Main = styled.View`
  height: 85%;
  justify-content: space-between;
  /* border: 1px solid #ffffff; */
  gap: 10px;
`;

const TimeContainer = styled.View`
  /* height: 20%; */
  justify-content: center;
  align-items: center;
`;
const Time = styled.Text`
  color: #222831;
  font-size: 96px;
  font-style: italic;
`;
const TimeText = styled.Text`
  color: #7b7b7b;
  font-size: 15px;
  font-style: normal;
`;

const CharacterContainer = styled.View`
  justify-content: center;
  align-items: center;
`;
const Point = styled.Text`
  color: #fff;
  font-size: 17px;
  font-style: normal;
  font-weight: 700;
`;
const CharacterImage = styled(Image)`
  width: 300px;
  height: 300px;
  object-fit: contain;
`;

const ButtonContainer = styled.View`
  height: 20%;
  justify-content: center;
  align-items: center;
`;
