import React from 'react';
import styled from 'styled-components/native';
import UserBar from '../components/mainScreen/UserBar';
import StyledTextTicker from '../components/mainScreen/StyledTextTicker';
import CharacterContents from '../components/characterScreen/CharacterContents';

const CharacterScreen = () => {
  return (
    <Wrapper>
      <UserBar />
      <StyledTextTicker text="포인트를 모아 캐릭터를 진화시켜보세요! 열심히 운동하면 포인트가 쌓여요! 포인트" />
      <CharacterContents />
    </Wrapper>
  );
};

export default CharacterScreen;

const Wrapper = styled.View`
  height: 100%;
  justify-content: flex-start;
  align-items: center;
  background-color: #222831;
  padding-top: 20px;
  gap: 15px;
`;
