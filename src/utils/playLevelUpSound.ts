import TrackPlayer from 'react-native-track-player';

export const playLevelUpSound = async () => {
  try {
    await TrackPlayer.reset(); // 이전 트랙 초기화

    await TrackPlayer.add({
      id: 'level-up',
      url: require('../sounds/levelUp.mp3'),
      title: 'Level Up',
      artist: 'System',
    });

    await TrackPlayer.play();
  } catch (error) {
    console.error('레벨업 사운드 재생 실패:', error);
  }
};
