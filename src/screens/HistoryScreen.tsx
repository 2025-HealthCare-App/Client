import React, {useState} from 'react';
import styled from 'styled-components/native';
import BottomBar from '../components/common/BottomBar';
import {Calendar} from 'react-native-calendars';
import {ScrollView} from 'react-native';
import Exercise from '../components/StatisticsScreen/Exercise';
import {ExerciseType} from '../types/exercise';

const HistoryScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');

  // 운동한 날짜들 표시
  const exerciseDays = {
    '2025-06-01': {marked: true},
    '2024-06-03': {marked: true},
    '2025-06-05': {marked: true},
    '2025-06-10': {marked: true},
    '2025-06-15': {marked: true},
  };

  // 예시 운동 데이터 (서버에서 받아온다고 가정)
  const dummyExercises: ExerciseType[] = [
    {
      exerciseId: 1,
      distance: 3934,
      steps: 234,
      elapsedSec: 2340,
      Kcal: 151,
      startTime: '13:22:00',
      endTime: '13:50:00',
      exTitle: 'CAUON - 제 2회 정기 러닝',
      points: 142,
      staticMapUrl: '',
      date: '2023-10-01',
    },
    {
      exerciseId: 2,
      distance: 1039,
      steps: 1454,
      elapsedSec: 1230,
      Kcal: 151,
      startTime: '19:29:00',
      endTime: '19:50:00',
      exTitle: '혼자 뛰기',
      points: 39,
      staticMapUrl: '',
      date: '2024-05-17',
    },
    {
      exerciseId: 3,
      distance: 1039,
      steps: 1454,
      elapsedSec: 1230,
      Kcal: 151,
      startTime: '19:29:00',
      endTime: '19:50:00',
      exTitle: '혼자 뛰기',
      points: 39,
      staticMapUrl: '',
      date: '2024-05-17',
    },
    {
      exerciseId: 4,
      distance: 1039,
      steps: 1454,
      elapsedSec: 1230,
      Kcal: 151,
      startTime: '19:29:00',
      endTime: '19:50:00',
      exTitle: '혼자 뛰기',
      points: 39,
      staticMapUrl: '',
      date: '2024-05-17',
    },
  ];

  return (
    <Wrapper>
      <Header>
        <Title>운동 기록</Title>
      </Header>

      <CalendarContainer>
        <Calendar
          style={{width: '100%'}}
          onDayPress={day => {
            console.log('선택된 날짜:', day.dateString);
            setSelectedDate(day.dateString);
          }}
          markedDates={exerciseDays}
          theme={{
            backgroundColor: '#222831',
            calendarBackground: '#222831',
            textSectionTitleColor: '#ffffff',
            selectedDayBackgroundColor: '#00adf5',
            selectedDayTextColor: '#02ADB5',
            todayTextColor: '#02ADB5',
            dayTextColor: '#ffffff',
            textDisabledColor: '#d9e1e8',
            dotColor: '#CDDC39',
            selectedDotColor: '#CDDC39',
            arrowColor: '#02ADB5',
            monthTextColor: '#ffffff',
          }}
          selected={selectedDate}
        />
      </CalendarContainer>

      <ActivitiesContainer>
        <ScrollView showsVerticalScrollIndicator={false}>
          {dummyExercises.map(exercise => (
            <Exercise key={exercise.exerciseId} {...exercise} />
          ))}
        </ScrollView>
      </ActivitiesContainer>

      <BottomBar />
    </Wrapper>
  );
};

export default HistoryScreen;

const Wrapper = styled.View`
  width: 100%;
  height: 100%;
  justify-content: space-between;
  align-items: center;
  background-color: #222831;
  padding-bottom: 60px; /* bottomBar 높이만큼 여백 추가 */
`;

const Header = styled.View`
  width: 90%;
  height: 10%;
  /* background-color: #787878; */
  justify-content: center;
  align-items: flex-start;
`;

const Title = styled.Text`
  font-size: 20px;
  color: #ffffff;
  font-weight: bold;
`;

const CalendarContainer = styled.View`
  width: 100%;
  margin-bottom: 30px;
`;

const ActivitiesContainer = styled.View`
  flex: 1;
  width: 95%;
`;
