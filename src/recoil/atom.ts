import {atom} from 'recoil';

//실제 DB에서는 user_id, password, birth 제외
export const userInfoAtom = atom({
  key: 'userInfo',
  default: {
    Uid: 0,
    name: '',
    profileImage: '',
    tier: 1, // tier는 숫자로 관리
    points: 0,
    level: 1,
    totalDistance: 0,
  },
});
