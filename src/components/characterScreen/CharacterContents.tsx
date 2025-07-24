import React from 'react';
import styled from 'styled-components/native';
import HealthRoadContainer from './HealthRoadContainer';
import TextBubble from './TextBubble';
import {userInfoAtom} from '../../recoil/atom';
import {useRecoilValue} from 'recoil';
import {getCharacterMessage} from '../../constants/characterMsg';

const CharacterContents = () => {
  const userInfo = useRecoilValue(userInfoAtom);

  const getCharacterImageSource = (level: number | undefined) => {
    switch (level) {
      case 1:
        return require('../../images/characters/character1.png');
      case 2:
        return require('../../images/characters/character2.png');
      case 3:
        return require('../../images/characters/character3.png');
      case 4:
        return require('../../images/characters/character4.png');
      case 5:
        return require('../../images/characters/character5.png');
      default:
        return require('../../images/characters/character1.png');
    }
  };

  return (
    <Wrapper>
      <HealthRoadContainer />
      <TextBubble text={getCharacterMessage(userInfo?.level)} />
      <Character>
        <Name>Lv.1</Name>
        <CharacterImage source={getCharacterImageSource(userInfo?.level)} />
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
  width: 95%;
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
const CharacterImage = styled.Image`
  width: 250px;
  height: 250px;
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
