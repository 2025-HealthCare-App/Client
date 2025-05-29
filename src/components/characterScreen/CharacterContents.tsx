import React from 'react';
import styled from 'styled-components/native';
import HealthRoadContainer from './HealthRoadContainer';

const CharacterContents = () => {
  return (
    <Wrapper>
      <HealthRoadContainer />
    </Wrapper>
  );
};

export default CharacterContents;

const Wrapper = styled.View`
  width: 100%;
  height: 85%;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: #393e46;
  border-radius: 18px;
  padding: 20px 20px;
  font-family: 'Pretendard';
`;
