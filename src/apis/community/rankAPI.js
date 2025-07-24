import axios from 'axios';
import {API_BASE_URL} from '@env';

// 랭킹 조회 API(토큰 필요X)
export const getRankingsAPI = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/week-ex/top-users`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
