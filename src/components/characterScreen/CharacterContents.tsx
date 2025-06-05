import React from 'react';
import styled from 'styled-components/native';
import HealthRoadContainer from './HealthRoadContainer';
import TextBubble from './TextBubble';

const CharacterContents = () => {
  return (
    <Wrapper>
      <HealthRoadContainer />
      <TextBubble text="빨리 커서 몸짱이 되고싶어!" />
      <Character>
        <Name>Lv.1</Name>
        <ChracterImage
          source={require('../../images/characters/character1.png')}
        />
      </Character>
      <LvUpContainer>
        <LvUpButton>
          <LVUpButtonText>Level UP !</LVUpButtonText>
        </LvUpButton>
        <PointText>5120 / 2500 P</PointText>
      </LvUpContainer>
    </Wrapper>
  );
};

export default CharacterContents;

const Wrapper = styled.View`
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: #393e46;
  border-radius: 18px;
  padding: 20px 20px;
  font-family: 'Pretendard';
`;

const Character = styled.View`
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;
const Name = styled.Text`
  font-size: 12px;
  color: #ffffff;
  font-family: 'Pretendard';
  margin-left: 10px;
`;
const ChracterImage = styled.Image`
  width: 300px;
  height: 300px;
`;

const LvUpContainer = styled.View`
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;
const LvUpButton = styled.TouchableOpacity`
  width: 150px;
  height: 50px;
  background-color: #feae00;
  border: 3px solid #a26f00;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
`;
const LVUpButtonText = styled.Text`
  font-size: 14px;
  color: #ffffff;
  font-family: 'Pretendard';
  font-weight: bold;
  text-align: center;
`;
const PointText = styled.Text`
  font-size: 14px;
  color: #ffffff;
  font-family: 'Pretendard';
  font-weight: bold;
`;
