import {atom} from 'recoil';

export const authState = atom({
  key: 'authState',
  default: {
    isLoggedIn: false, // 기본값은 로그아웃 상태
  },
});
