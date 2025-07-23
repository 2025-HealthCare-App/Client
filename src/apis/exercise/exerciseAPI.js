import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_BASE_URL} from '@env';

//나의 모든 운동 조회 API
export const getMyAllExercisesAPI = async () => {
  try {
    const token = await AsyncStorage.getItem('token');

    const response = await axios.get(`${API_BASE_URL}/exercises/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

//나의 최근 3개 운동 조회 API
export const getMyRecentExercisesAPI = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('토큰이 존재하지 않습니다.');
    }

    const response = await axios.get(`${API_BASE_URL}/exercises/recent`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 나의 운동 Post API
export const postMyExercisesAPI = async exerciseData => {
  try {
    // 저장된 JWT 토큰 불러오기
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('토큰이 존재하지 않습니다.');
    }

    // 요청 보내기
    const response = await axios.post(
      `${API_BASE_URL}/exercises`,
      exerciseData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error('운동 데이터 전송 실패:', error);
    throw error;
  }
};
