export const distanceMessages = [
  {threshold: 320000, message: '서울역 ~ 부산 광안대교'},
  {threshold: 270000, message: '서울역 ~ 광주 5.18 민주광장'},
  {threshold: 240000, message: '서울역 ~ 대구 83타워'},
  {threshold: 190000, message: '경주 불국사'},
  {threshold: 180000, message: '서울역 ~ 안동 하회마을'},
  {threshold: 160000, message: '서울역 ~ 전주 한옥마을'},
  {threshold: 140000, message: '천안 독립기념관'},
  {threshold: 120000, message: '서울역 ~ 대전(성심당)'},
  {threshold: 100000, message: '서울역 ~ 청주(상당산성)'},
  {threshold: 80000, message: '안산 대부도'},
  {threshold: 50000, message: '가평 청평호'},
  {threshold: 40000, message: '서울역 ~ 용인(에버랜드)'},
  {threshold: 30000, message: '서울역 ~ 수원(수원화성)'},
  {threshold: 20000, message: '서울역 ~ 과천(서울대공원)'},
  {threshold: 10000, message: '여의도 한바퀴(고구마런)'},
  {threshold: 5000, message: '서울역 ~ 남산 서울타워'},
  {threshold: 3000, message: '서울역 ~ 명동'},
  {threshold: 1000, message: '서울역 ~ 숭례문'},
  {threshold: 400, message: '운동장 한 바퀴'},
];

export const getMilestoneMessage = (distance: number): string => {
  for (const {threshold, message} of distanceMessages) {
    if (distance >= threshold) {
      return `지금까지 ${message}까지 달렸어요!`;
    }
  }
  return '이제 첫 발걸음을 시작했어요!';
};
