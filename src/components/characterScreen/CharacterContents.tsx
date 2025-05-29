import React from 'react';
import styled from 'styled-components/native';

const CharacterContents = () => {
  return (
    <Wrapper>
      <HealthRoadContainer>
        <HealthRoadBox>
          <HealthRoadImage />
          <HealthRoadText>건강의 길</HealthRoadText>
        </HealthRoadBox>
      </HealthRoadContainer>
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

const HealthRoadContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

const HealthRoadBox = styled.View`
  width: 27%;
  height: 35px;
  background-color: #ffb6b6;
  border: 3px solid #ff9292;
  border-radius: 100px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 5px;
`;

const HealthRoadImage = styled.Image.attrs({
  source: require('../../images/characterScreen/health_road.png'),
  resizeMode: 'contain',
  style: {width: 15, height: 15},
})`
  width: 15px;
  height: 15px;
`;

const HealthRoadText = styled.Text`
  font-size: 10px;
  font-weight: bold;
  color: #ffffff;
  font-family: 'Pretendard';
  text-align: center;
`;
