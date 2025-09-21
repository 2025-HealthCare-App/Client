import React, {useCallback, useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {Calendar} from 'react-native-calendars';
import {ScrollView} from 'react-native';
import Exercise from '../components/StatisticsScreen/Exercise';
import {ExerciseType, toExerciseType} from '../types/exerciseType';
import {
  getExerciseDaysByMonthAPI,
  getExercisesByDateAPI,
} from '../apis/history/dateExAPI';
import {useFocusEffect} from '@react-navigation/native';

const HistoryScreen = () => {
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [dayExercises, setDayExercises] = useState<ExerciseType[]>([]);
  const [exerciseDays, setExerciseDays] = useState<{
    [key: string]: {
      marked?: boolean;
      selected?: boolean;
      selectedColor?: string;
    };
  }>({});

  // 날짜 눌렀을 때 함수
  const handleDayPress = (day: {dateString: string}) => {
    setSelectedDate(day.dateString);
    getExercisesByDateAPI(day.dateString)
      .then(data => {
        setDayExercises(data.exercises.map(toExerciseType));
      })
      .catch(error => {
        console.error('운동 데이터 가져오기 실패:', error);
      });
  };

  // 화면이 포커스를 받을 때마다 오늘 날짜 운동 데이터 최신화
  useFocusEffect(
    useCallback(() => {
      if (selectedDate) {
        getExercisesByDateAPI(selectedDate)
          .then(data => {
            setDayExercises(data.exercises.map(toExerciseType));
          })
          .catch(error => {
            console.error('운동 데이터 가져오기 실패:', error);
          });
      }
    }, [selectedDate]),
  );

  // 컴포넌트가 마운트될 때 현재 날짜로 초기화
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear().toString();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const date = today.getDate().toString().padStart(2, '0');

    setSelectedYear(year);
    setSelectedMonth(month);
    setSelectedDate(`${year}-${month}-${date}`);
  }, []);

  // 해당하는 년, 월의 며칠에 운동했는지 조회하는 API 호출
  useEffect(() => {
    if (selectedYear && selectedMonth) {
      getExerciseDaysByMonthAPI(selectedYear, selectedMonth)
        .then(days => {
          const markedDays: {
            [key: string]: {
              marked?: boolean;
              selected?: boolean;
              selectedColor?: string;
            };
          } = {};

          days.forEach((day: number) => {
            const formattedDay = String(day).padStart(2, '0');
            const dateStr = `${selectedYear}-${selectedMonth}-${formattedDay}`;
            markedDays[dateStr] = {
              marked: true,
            };
          });

          // 선택한 날짜를 별도로 추가 또는 덮어쓰기
          markedDays[selectedDate] = {
            ...(markedDays[selectedDate] || {}),
            selected: true,
            selectedColor: '#ffffff',
          };

          setExerciseDays(markedDays);
        })
        .catch(error => {
          console.error('운동 날짜 가져오기 실패:', error);
        });
    }
  }, [selectedYear, selectedMonth, selectedDate]);

  return (
    <Wrapper>
      <Header>
        <Title>운동 기록</Title>
      </Header>

      <CalendarContainer>
        <Calendar
          style={{width: '100%'}}
          onDayPress={handleDayPress}
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
          onMonthChange={(month: {year: number; month: number}) => {
            setSelectedYear(month.year.toString());
            setSelectedMonth(month.month.toString().padStart(2, '0'));
          }}
        />
      </CalendarContainer>

      <ActivitiesContainer>
        <ScrollView showsVerticalScrollIndicator={false}>
          {dayExercises.length > 0 ? (
            dayExercises.map(exercise => (
              <Exercise key={exercise.exerciseId} {...exercise} />
            ))
          ) : (
            <Title
              style={{
                textAlign: 'center',
                marginTop: 20,
                fontSize: 14,
                color: '#4e5a6b',
              }}>
              선택한 날짜에 운동 기록이 없어요!
            </Title>
          )}
        </ScrollView>
      </ActivitiesContainer>
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
  margin-bottom: 20px;
`;

const ActivitiesContainer = styled.View`
  flex: 1;
  width: 90%;
`;
