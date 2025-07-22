import axios from 'axios';
import {API_BASE_URL} from '@env';

//게시글 조회 API
export const getPostsAPI = async page => {
  try {
    const response = await axios.get(`${API_BASE_URL}/posts`, {
      params: {page},
    });
    return response.data;
  } catch (error) {
    console.error('게시물 조회 실패:', error?.response?.data || error.message);
    throw new Error('게시글을 불러오지 못했습니다. 다시 시도해주세요.');
  }
};
