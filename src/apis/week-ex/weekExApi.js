import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_BASE_URL} from '@env';

// 나의 이번주 목표 조회 API
export const getMyWeekGoalAPI = async () => {
  try {
    const token = await AsyncStorage.getItem('token');

    const response = await axios.get(`${API_BASE_URL}/week-ex/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

//나의 이번주 목표 설정 API
export const setMyWeekGoalAPI = async target_distance => {
  try {
    const token = await AsyncStorage.getItem('token');

    const response = await axios.post(
      `${API_BASE_URL}/week-ex`,
      {target_distance},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log('setMyWeekGoalAPI response:', response.data); //TODO: remove this log in production
    return response.data;
  } catch (error) {
    throw error;
  }
};

//이번 주 요일별 평균 거리 조회 API(토큰X)
export const getWeekAvgDistanceAPI = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/exercises/weekly-daily-avg`,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
