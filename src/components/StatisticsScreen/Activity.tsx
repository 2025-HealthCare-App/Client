import React from 'react';
import styled from 'styled-components/native';

const Activity = () => {
  return (
    <Wrapper>
      <Top>
        <DateAndPoint>
          <Date>2023.10.01</Date>
          <Point>+ 142 P</Point>
        </DateAndPoint>
        <ActivityTitle>CAUON - 제 2회 정기 러닝</ActivityTitle>
      </Top>
      <Bottom>
        <Category id="time">
          <Value>39:03</Value>
          <CategoryText>Time</CategoryText>
        </Category>
        <Category id="km">
          <Value>1.2</Value>
          <CategoryText>Km</CategoryText>
        </Category>
        <Category id="step">
          <Value>4,210</Value>
          <CategoryText>Step</CategoryText>
        </Category>
      </Bottom>
    </Wrapper>
  );
};

export default Activity;

const Wrapper = styled.TouchableOpacity`
  width: 100%;
  height: 140px;
  background-color: #ffffff;
  border-radius: 5px;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 25px;
`;
const Top = styled.View`
  width: 100%;
  height: 45%;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  /* background: #bbd6ff; */
  padding-bottom: 15px;
  border-bottom-width: 0.7px;
  border-bottom-color: #dddddd;
`;
const DateAndPoint = styled.View`
  width: 100%;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`;
const Date = styled.Text`
  font-size: 11px;
  color: #393e46;
  text-align: center;
  color: #6f6f6f;
`;
const Point = styled.Text`
  font-size: 11px;
  color: #393e46;
  font-weight: bold;
  text-align: center;
  color: #6f6f6f;
`;
const ActivityTitle = styled.Text`
  width: 100%;
  font-size: 13px;
  color: #222831;
  font-weight: bold;
  text-align: left;
`;

const Bottom = styled.View`
  width: 100%;
  height: 40%;
  /* background: #ff9090; */
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`;
const Category = styled.View`
  height: 100%;
  /* width: 33%; */
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const Value = styled.Text`
  font-size: 18px;
  color: #222831;
  font-weight: bold;
`;
const CategoryText = styled.Text`
  font-size: 9px;
  color: #6f6f6f;
`;
