export const distanceMessages = [
  {threshold: 320000, message: '서울역에서 부산 광안대교까지'},
  {threshold: 270000, message: '서울역에서 광주 5.18 민주광장까지'},
  {threshold: 240000, message: '서울역에서 대구 83타워까지'},
  {threshold: 190000, message: '서울역에서 경주 불국사까지'},
  {threshold: 180000, message: '서울역에서 안동 하회마을까지'},
  {threshold: 160000, message: '서울역에서 전주 한옥마을까지'},
  {threshold: 140000, message: '서울역에서 천안 독립기념관까지'},
  {threshold: 120000, message: '서울역에서 대전(성심당)까지'},
  {threshold: 100000, message: '서울역에서 청주(상당산성)까지'},
  {threshold: 80000, message: '서울역에서 안산 대부도까지'},
  {threshold: 50000, message: '서울역에서 가평 청평호까지'},
  {threshold: 40000, message: '서울역에서 용인(에버랜드)까지'},
  {threshold: 30000, message: '서울역에서 수원(수원화성)까지'},
  {threshold: 20000, message: '서울역에서 과천(서울대공원)까지'},
  {threshold: 10000, message: '여의도 한바퀴(고구마런)를'},
  {threshold: 5000, message: '서울역에서 남산 서울타워까지'},
  {threshold: 3000, message: '서울역에서 명동까지'},
  {threshold: 1000, message: '서울역에서 숭례문까지'},
  {threshold: 400, message: '운동장 한 바퀴를'},
];

export const getMilestoneMessage = (distance: number): string => {
  for (const {threshold, message} of distanceMessages) {
    if (distance >= threshold) {
      return `${message} 달렸어요!`;
    }
  }
  return '이제 첫 발걸음을 시작했어요!';
};
