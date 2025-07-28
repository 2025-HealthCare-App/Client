//action_code를 한글로 바꾸는 함수
export const convertActionCodeToText = (actionCode: string): string => {
  switch (actionCode) {
    case 'EXERCISE_TODAY':
      return '오늘의 첫 운동';
    case 'WALK_1KM':
      return '1km 걷기';
    case 'WALK_3KM':
      return '3km 걷기';
    case 'POST_TODAY':
      return '오늘의 게시글 작성';
    case 'WALK_DISTANCE_BONUS':
      return '거리별 보너스';
    default:
      return actionCode; // 알 수 없는 코드인 경우 그대로 반환
  }
};
