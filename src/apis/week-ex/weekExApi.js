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
export const postOrPatchMyWeekGoalAPI = async target_distance => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('토큰이 없습니다.');
    }

    const response = await axios.post(
      `${API_BASE_URL}/week-ex`,
      {target_distance},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error('주간 목표 설정/수정 실패:', error);
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

//나의 이번주 요일별 평균 거리 조회 API
export const getMyWeekAvgDistanceAPI = async () => {
  try {
    const token = await AsyncStorage.getItem('token');

    const response = await axios.get(
      `${API_BASE_URL}/exercises/my-weekly-distances`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
