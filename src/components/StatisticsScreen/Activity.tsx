import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import styled from 'styled-components/native';
import {addComma, formatElapsedTime, formatTime} from '../../utils/util';

interface ActivityProps {
  distance: number; // in meters
  steps: number;
  elapsedSec: number; // in seconds
  Kcal: number;
  startTime: string; // formatted as 'YYYY.MM.DD HH:mm'
  staticMapUrl?: string; // URL for the static map image
  activityTitle: string; // title of the activity
  points: number; // points earned from the activity
}

const Activity = ({
  distance,
  steps,
  elapsedSec,
  Kcal,
  startTime,
  staticMapUrl,
  activityTitle,
  points,
}: ActivityProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const goToResult = () => {
    navigation.navigate('Result', {
      distance: distance, // 1.2km = 1200m
      steps: steps,
      elapsedSec: elapsedSec, // 39분 3초 = 39*60 + 3 = 2343초
      Kcal: Kcal,
      startTime: startTime,
      staticMapUrl:
        staticMapUrl ||
        'https://maps.googleapis.com/maps/api/staticmap?size=600x400&path=color:0xff0000ff|weight:5|37.5031393,126.9571197&key=AIzaSyBEyEYuNOq8OreVSXUgbPSJDurTYlM6vTg', // default URL if not provided
      activityTitle: activityTitle || '오늘의 달리기', // default title if not provided
      points: points || 142, // default points if not provided
    });
  };

  return (
    <Wrapper onPress={goToResult}>
      <Top>
        <DateAndPoint>
          <Date>{startTime}</Date>
          <Point>+ {points} P</Point>
        </DateAndPoint>
        <ActivityTitle>{activityTitle}</ActivityTitle>
      </Top>
      <Bottom>
        <Category id="time">
          <Value>{formatElapsedTime(elapsedSec)}</Value>
          <CategoryText>Time</CategoryText>
        </Category>
        <Category id="km">
          <Value>{(distance / 1000).toFixed(2)}</Value>
          <CategoryText>Km</CategoryText>
        </Category>
        <Category id="step">
          <Value>{addComma(steps)}</Value>
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
  margin-bottom: 15px;
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
