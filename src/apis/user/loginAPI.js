import axios from 'axios';
import {API_BASE_URL} from '@env';

export const loginAPI = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/login`, {
      username,
      password,
    });

    console.log('Login successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};
