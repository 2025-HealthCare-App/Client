//티어 숫자를 텍스트 이름으로 바꿔주는 함수
export const convertTierToText = (tier: number): string => {
  switch (tier) {
    case 1:
      return '초보';
    case 2:
      return '중수';
    case 3:
      return '고수';
    case 4:
      return '지존';
    default:
      return '알 수 없음';
  }
};
