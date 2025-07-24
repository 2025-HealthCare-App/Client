import {API_BASE_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

//프로필 이미지 변경 API
export const changeProfileImageAPI = async imageData => {
  try {
    const token = await AsyncStorage.getItem('token');

    const formData = new FormData();
    formData.append('profile_image', {
      uri: imageData.uri,
      type: imageData.type,
      name: imageData.fileName,
    });

    const response = await axios.patch(
      `${API_BASE_URL}/users/profile-image`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
