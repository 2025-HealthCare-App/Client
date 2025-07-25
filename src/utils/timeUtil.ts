// 경과 시간 계산 함수(startTime과 endTime을 초로 변환)
export const getElapsedSec = (start: string, end: string): number => {
  const [sh, sm, ss] = start.split(':').map(Number);
  const [eh, em, es] = end.split(':').map(Number);
  const startSec = sh * 3600 + sm * 60 + ss;
  const endSec = eh * 3600 + em * 60 + es;
  return endSec - startSec;
};
//created_at에서 날짜 추출 함수
export const getDateFromCreatedAt = (createdAt: string): string => {
  const date = new Date(createdAt);
  return date.toISOString().split('T')[0]; // 'YYYY-MM-DD' 형식으로 반환
};

//'1:42:00 PM' 형식을 '13:42:00' 24시간 형식으로 변환
export const convertTo24Hour = (timeStr: string): string => {
  const [time, modifier] = timeStr.split(' '); // '1:42:00', 'PM'
  let [hours, minutes, seconds] = time.split(':').map(Number);

  if (modifier === 'PM' && hours < 12) {
    hours += 12;
  }
  if (modifier === 'AM' && hours === 12) {
    hours = 0;
  }

  // pad single digit with leading zero
  const pad = (num: number): string => String(num).padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

// startTime과 endTime을 받아서 초 단위로 경과 시간 계산
export const calculateElapsedSec = (
  startTime: string,
  endTime: string,
): number => {
  const [startH, startM, startS] = startTime.split(':').map(Number);
  const [endH, endM, endS] = endTime.split(':').map(Number);

  const startTotalSec = startH * 3600 + startM * 60 + startS;
  const endTotalSec = endH * 3600 + endM * 60 + endS;

  return endTotalSec - startTotalSec;
};
