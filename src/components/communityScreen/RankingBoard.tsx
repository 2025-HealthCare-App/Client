import React from 'react';
import styled from 'styled-components/native';

const RankingBoard = () => {
  return (
    <>
      <Wrapper>
        <Title>이번주 실시간 랭킹</Title>
      </Wrapper>
      <CardArrow />
    </>
  );
};

export default RankingBoard;

const Wrapper = styled.View`
  width: 100%;
  height: 40%;
  justify-content: flex-start;
  align-items: center;
  background-color: #393e46;
  padding: 20px;
`;
const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 20px;
  text-align: center;
  width: 100%;
`;

const CardArrow = styled.View`
  width: 0;
  height: 0;
  border-left-width: 100px;
  border-right-width: 100px;
  border-top-width: 50px;
  border-left-color: transparent;
  border-right-color: transparent;
  border-top-color: #3b3f47;
`;
