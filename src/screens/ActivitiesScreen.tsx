import React, {useState} from 'react';
import styled from 'styled-components/native';
import BottomBar from '../components/common/BottomBar';
import {Calendar} from 'react-native-calendars';
import {ScrollView} from 'react-native';
import Activity from '../components/StatisticsScreen/Activity';

const ActivitiesScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  return (
    <Wrapper>
      <Header>
        <Title>운동 기록</Title>
      </Header>

      <CalendarContainer>
        <Calendar
          style={{
            width: '100%',
          }}
          onDayPress={day => {
            console.log('선택된 날짜:', day.dateString);
            setSelectedDate(day.dateString);
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

      <ActivitiesContainer>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Activity
            distance={3934}
            steps={234}
            elapsedSec={2340}
            Kcal={151}
            startTime="2023.10.01 13:22"
            activityTitle="CAUON - 제 2회 정기 러닝"
            points={142}
          />
          <Activity
            distance={1039}
            steps={1454}
            elapsedSec={1230}
            Kcal={151}
            startTime="2024.05.17 19:29"
            activityTitle="혼자 뛰기"
            points={39}
          />
          <Activity
            distance={1039}
            steps={1454}
            elapsedSec={1230}
            Kcal={151}
            startTime="2024.05.17 19:29"
            activityTitle="혼자 뛰기"
            points={39}
          />
          <Activity
            distance={1039}
            steps={1454}
            elapsedSec={1230}
            Kcal={151}
            startTime="2024.05.17 19:29"
            activityTitle="혼자 뛰기"
            points={39}
          />
        </ScrollView>
      </ActivitiesContainer>

      <BottomBar />
    </Wrapper>
  );
};

export default ActivitiesScreen;

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
