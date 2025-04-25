import React from 'react';
import styled from 'styled-components/native';

const RunningButton = () => {
  return (
    <Wrapper>
      <PauseShape>
        <Stick />
        <Stick />
      </PauseShape>
    </Wrapper>
  );
};

export default RunningButton;

const Wrapper = styled.View`
  background-color: #222831;
  width: 125px;
  height: 125px;
  border-radius: 100px;
  justify-content: center;
  align-items: center;
`;

const PauseShape = styled.View`
  width: 17%;
  height: 23%;
  flex-direction: row;
  justify-content: space-between;
`;
const Stick = styled.View`
  height: 100%;
  width: 5px;
  background-color: #ffffff;
`;
