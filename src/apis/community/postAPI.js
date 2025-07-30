import axios from 'axios';
import {API_BASE_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import mime from 'react-native-mime-types';

// 게시글 조회 API
export const getPostsAPI = async (page = 1) => {
  try {
    const token = await AsyncStorage.getItem('token'); // ✅ 토큰 읽기

    const response = await axios.get(`${API_BASE_URL}/posts`, {
      params: {page},
      headers: {
        Authorization: `Bearer ${token}`, // ✅ 토큰 추가
      },
    });
    console.log('게시물 조회 성공:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('게시물 조회 실패:', error?.response?.data || error.message);
    throw new Error('게시글을 불러오지 못했습니다. 다시 시도해주세요.');
  }
};
// 게시글 업로드 API (토큰 기반 인증)
export const uploadPost = async ({postContent, imageUri}) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const formData = new FormData();
    formData.append('post_content', postContent);

    // 이미지가 있을 경우 추가
    if (imageUri) {
      const fileName = imageUri.split('/').pop(); // 예: photo.jpg
      const mimeType = mime.lookup(imageUri) || 'image/jpeg'; // 확장자 기반 MIME 추론

      formData.append('post_image', {
        uri: imageUri,
        name: fileName,
        type: mimeType,
      });
    }

    const response = await axios.post(`${API_BASE_URL}/posts`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      '게시글 업로드 실패:',
      error?.response?.data || error.message,
    );
    throw new Error('게시글을 업로드하지 못했습니다. 다시 시도해주세요.');
  }
};

//오늘의 게시글 작성 여부 확인 API
export const checkTodayPost = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/posts/check-daily`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      '오늘의 게시글 작성 여부 확인 실패:',
      error?.response?.data || error.message,
    );
    throw new Error('오늘의 게시글 작성 여부를 확인하지 못했습니다.');
  }
};

//게시글 좋아요 API
export const likePost = async postId => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.post(
      `${API_BASE_URL}/posts/${postId}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(
      '게시글 좋아요 실패:',
      error?.response?.data || error.message,
    );
    throw new Error('게시글 좋아요를 처리하지 못했습니다. 다시 시도해주세요.');
  }
};
