import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_BASE_URL} from '@env';

// 특정 날짜의 운동 기록 조회 API
export const getExercisesByDateAPI = async date => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('토큰이 존재하지 않습니다.');
    }
    const response = await axios.get(`${API_BASE_URL}/exercises/by-date`, {
      params: {date}, // ✅ 쿼리 파라미터로 전달
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

// 특정 년-월의 며칠에 운동을 했는지 조회 API
export const getExerciseDaysByMonthAPI = async (year, month) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('토큰이 존재하지 않습니다.');
    }

    // 👉 month 앞에 0 붙이기 (ex: 7 → '07')
    const formattedMonth = String(month).padStart(2, '0');

    const response = await axios.get(`${API_BASE_URL}/exercises/days`, {
      params: {year, month: formattedMonth}, // ✅ 쿼리 파라미터로 전달
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.days; // 👉 days 배열만 반환
  } catch (error) {
    console.error(
      '월간 운동 일자 조회 실패:',
      error?.response?.data || error.message,
    );
    throw new Error('월간 운동 일자를 불러오지 못했습니다.');
  }
};
