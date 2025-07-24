import {Alert} from 'react-native';

//캐릭터 레벨에 따라 다음 레벨로 업그레이드 하기위한 포인트 반환
export const getPointsForNextLevel = (level: number): number | string => {
  switch (level) {
    case 1:
      return 1500;
    case 2:
      return 2500;
    case 3:
      return 3500;
    case 4:
      return 4500;
    default:
      return '-'; // 5레벨 이상은 더 이상 포인트가 필요 없음
  }
};

//보유 포인트를 확인하여 다음 레벨로 진급 가능한지 여부를 반환
export const levelUp = (curPoints: number, level: number): boolean => {
  const pointsForNextLevel = getPointsForNextLevel(level);
  if (typeof pointsForNextLevel === 'number') {
    if (curPoints >= pointsForNextLevel) {
      //API 호출로 레벨 업 처리
      Alert.alert(
        '레벨 업!',
        `축하합니다! 레벨이 ${level + 1}로 업그레이드 되었습니다.`,
        [{text: '확인'}],
      );
      return true;
    } // 다음 레벨로 진급 가능
  } else {
    Alert.alert('레벨 업 불가', '포인트가 부족합니다.', [{text: '확인'}]);
    // 5레벨 이상은 진급 불가
    return false; // 현재 포인트로는 진급 불가
  }
  // 현재 포인트로는 진급 불가
  Alert.alert('레벨 업 불가', '이미 최고 레벨입니다.', [{text: '확인'}]);
  return false; // 5레벨 이상은 진급 불가
};
