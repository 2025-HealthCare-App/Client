import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_BASE_URL} from '@env';

export const getMyExercisesAPI = async () => {
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

//임시
export const getAllExercisesAPI = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/exercises`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
