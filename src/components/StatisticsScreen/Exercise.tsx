import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import styled from 'styled-components/native';
import {addComma, formatElapsedTime} from '../../utils/util';
import {ExerciseType} from '../../types/exercise';

type Props = {
  exercise: ExerciseType;
};

const Exercise = ({exercise}: Props) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const {
    distance,
    steps,
    elapsedSec,
    Kcal,
    startTime,
    staticMapUrl,
    exTitle,
    points,
    date,
  } = exercise;

  const goToResult = () => {
    navigation.navigate('Result2', {
      ...exercise, // 한 줄로 모든 정보 전달
    });
  };

  return (
    <Wrapper onPress={goToResult}>
      <Top>
        <DateAndPoint>
          <Date>
            {date} {startTime}
          </Date>
          <Point>+ {points} P</Point>
        </DateAndPoint>
        <ExerciseTitle>{exTitle}</ExerciseTitle>
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

export default Exercise;

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
const ExerciseTitle = styled.Text`
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
