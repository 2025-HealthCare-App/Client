import axios from 'axios';
import {API_BASE_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 랭킹 조회 API(토큰 필요X)
export const getRankingsAPI = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/week-ex/top-users`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//나의 상위 퍼센트 조회 API(토큰 필요)
export const getMyRankAPI = async () => {
  try {
    const token = await AsyncStorage.getItem('token');

    const response = await axios.get(
      `${API_BASE_URL}/week-ex/my-rank-percent`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response;
  } catch (error) {
    throw error;
  }
};
