import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_BASE_URL} from '@env';

// 최근 20개 포인트 내역 조회하는 API
export const getRecentPoints = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('토큰이 존재하지 않습니다.');
    }

    const response = await axios.get(`${API_BASE_URL}/points/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
