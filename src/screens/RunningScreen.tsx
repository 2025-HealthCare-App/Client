import React, {useState} from 'react';
import {Image} from 'react-native';
import styled from 'styled-components/native';
import RunningButton from '../components/runningScreen/RunningButton';

const RunningScreen = () => {
  const [isRunning, setIsRunning] = useState(true);

  const handleRunningButtonPress = () => {
    setIsRunning(!isRunning);
  };

  return (
    <Wrapper isRunning={isRunning}>
      <RecordsContainer isRunning={isRunning}>
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
          <Point isRunning={isRunning}>+ 142 P</Point>
          <CharacterImage
            source={require('../images/characters/character1.png')}
          />
        </CharacterContainer>
        <ButtonContainer>
          {isRunning ? (
            <RunningButton option="pause" onPress={handleRunningButtonPress} />
          ) : (
            <>
              <RunningButton option="stop" onPress={handleRunningButtonPress} />
              <RunningButton
                option="start"
                onPress={handleRunningButtonPress}
              />
            </>
          )}
        </ButtonContainer>
      </Main>
    </Wrapper>
  );
};

export default RunningScreen;

const Wrapper = styled.View<{isRunning: boolean}>`
  height: 100%;
  width: 100%;
  padding: 50px 25px;
  background-color: ${({isRunning}) => (isRunning ? '#CDD800' : '#ffffff')};
  gap: 20px;
`;

const RecordsContainer = styled.View<{isRunning: boolean}>`
  width: 100%;
  height: 12%;
  flex-direction: row;
  justify-content: space-between;
  background-color: ${({isRunning}) => (isRunning ? '#b6bf00' : '#F4F4F4')};
  justify-content: center;
  align-items: center;
  border-radius: 15px;

  elevation: 7;
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
  align-items: center;
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
const Point = styled.Text<{isRunning: boolean}>`
  color: ${({isRunning}) => (isRunning ? '#ffffff' : '#8D8D8D')};
  font-size: 17px;
  font-style: normal;
  font-weight: 700;
`;
const CharacterImage = styled(Image)`
  width: 270px;
  height: 270px;
  object-fit: contain;
`;

const ButtonContainer = styled.View`
  height: 20%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 70px;
`;
