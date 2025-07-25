import {API_BASE_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

//레벨업 API
export const levelUpAPI = async () => {
  try {
    const token = await AsyncStorage.getItem('token');

    const response = await axios.patch(
      `${API_BASE_URL}/users/level-up`,
      {},
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
