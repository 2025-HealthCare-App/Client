import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_BASE_URL} from '@env';

export const getWeeklyRewardStatusAPI = async () => {
  console.log('getWeeklyRewardStatusAPI 호출됨');
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('로그인이 필요합니다.');
    }
    const response = await axios.get(
      `${API_BASE_URL}/users/weekly-reward-status`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    // console.log('주간 보상 상태 조회 응답:', response.data);
    return response.data; // { success: true, received: false } 또는 { success: true, received: true, tier: 2, rewardPoints: 200 }
  } catch (error) {
    // console.error('주간 보상 상태 조회 실패:', error);
    throw error;
  }
};

//AsyncStorage에 lastRewardAlertWeek있는지 확인하는 함수
export const checkRewardWeekValue = async () => {
  try {
    const value = await AsyncStorage.getItem('lastRewardAlertWeek');
    if (value !== null) {
      console.log('현재 저장된 lastRewardAlertWeek:', value);
    } else {
      console.log('lastRewardAlertWeek 값이 없습니다.');
    }
  } catch (e) {
    console.error('AsyncStorage 조회 오류:', e);
  }
};
