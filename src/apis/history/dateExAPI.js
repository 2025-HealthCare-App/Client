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
