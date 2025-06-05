import React, {useState} from 'react';
import styled from 'styled-components/native';
import BottomBar from '../components/common/BottomBar';
import {Calendar} from 'react-native-calendars';

const ActivitiesScreen = () => {
  return (
    <Wrapper>
      <CalendarContainer>
        <Calendar
          style={{
            width: '100%',
            height: '100%',
          }}
          onDayPress={day => {
            console.log('선택된 날짜:', day.dateString);
          }}
          markedDates={{
            '2024-03-15': {marked: true, dotColor: 'red'},
            '2024-03-20': {selected: true, selectedColor: 'blue'},
          }}
          theme={{
            backgroundColor: '#222831',
            calendarBackground: '#222831',
            textSectionTitleColor: '#ffffff',
            selectedDayBackgroundColor: '#00adf5',
            selectedDayTextColor: '#02ADB5',
            todayTextColor: '#02ADB5',
            dayTextColor: '#ffffff',
            textDisabledColor: '#d9e1e8',
            dotColor: '#02ADB5',
            arrowColor: '#02ADB5',
            monthTextColor: '#ffffff',
          }}
        />
      </CalendarContainer>
      <BottomBar />
    </Wrapper>
  );
};

export default ActivitiesScreen;

const Wrapper = styled.View`
  height: 100%;
  justify-content: space-between;
  align-items: center;
  background-color: #222831;
  padding: 0px 20px;
  padding-bottom: 60px; /* bottomBar 높이만큼 여백 추가 */
`;

const CalendarContainer = styled.View`
  flex: 1; /* 남은 공간 모두 차지 */
  width: 100%;
`;
