import {Alert} from 'react-native';
import {levelUpAPI} from '../apis/character/characterAPI';
import {playLevelUpSound} from './playLevelUpSound';

//캐릭터 레벨에 따라 다음 레벨로 업그레이드 하기위한 포인트 반환
export const getPointsForNextLevel = (level: number): number => {
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
      levelUpAPI()
        .then(() => {
          //효과음 재생
          playLevelUpSound();
          Alert.alert('레벨 업 성공', '축하합니다! 레벨이 올랐습니다.', [
            {text: '확인'},
          ]);
        })
        .catch(error => {
          console.error('레벨 업 실패:', error);
          Alert.alert(
            '레벨 업 실패',
            '레벨 업에 실패했습니다. 다시 시도해주세요.',
            [{text: '확인'}],
          );
        });
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

//캐릭터 레벨에 따라 이미지를 불러오는 함수
export const getCharacterImageSource = (level: number | undefined) => {
  switch (level) {
    case 1:
      return require('../images/characters/character1.png');
    case 2:
      return require('../images/characters/character2.png');
    case 3:
      return require('../images/characters/character3.png');
    case 4:
      return require('../images/characters/character4.png');
    case 5:
      return require('../images/characters/character5.png');
    default:
      return require('../images/characters/character1.png');
  }
};
