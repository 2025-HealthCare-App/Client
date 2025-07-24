import React from 'react';
import styled from 'styled-components/native';
import HealthRoadContainer from './HealthRoadContainer';
import TextBubble from './TextBubble';
import {userInfoAtom} from '../../recoil/atom';
import {useRecoilState} from 'recoil';

const CharacterContents = () => {
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);

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
      <TextBubble text="빨리 커서 몸짱이 되고싶어!" />
      <Character>
        <Name>Lv.1</Name>
        <ChracterImage source={getCharacterImageSource(userInfo?.level)} />
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
