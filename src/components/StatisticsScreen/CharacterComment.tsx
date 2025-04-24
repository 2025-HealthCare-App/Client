import React from 'react';
import styled from 'styled-components/native';
import SpeechBubble from './SpeechBubble';
import {Image} from 'react-native';

const CharacterComment = () => {
  return (
    <Wrapper>
      <CharacterAndKm>
        <CharacterImg
          source={require('../../images/characters/character1.png')}
        />
        <KmText>5km</KmText>
      </CharacterAndKm>
      <SpeechBubble />
    </Wrapper>
  );
};

export default CharacterComment;

const Wrapper = styled.View`
  width: 100%;
  height: 70px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 40px;
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
