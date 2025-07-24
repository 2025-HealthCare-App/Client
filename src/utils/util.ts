//천 단위로 콤마 붙이는 함수
export const addComma = (value: number) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

//시작 시각을 포맷팅
export const formatStartTime = (startTime: number) => {
  const date = new Date(startTime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// 거리 계산 함수 (Haversine)
export const getDistance = (lat1: any, lon1: any, lat2: any, lon2: any) => {
  const R = 6371e3;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

//Static Map URL 변환 함수
export const createStaticMapUrl = (
  route: {latitude: number; longitude: number}[],
  apiKey: string,
) => {
  const size = '600x400';
  const path = route.map(p => `${p.latitude},${p.longitude}`).join('|');

  const url = `https://maps.googleapis.com/maps/api/staticmap?size=${size}&path=color:0xff0000ff|weight:5|${path}&key=${apiKey}`;
  return url;
};

//시간 포맷팅 함수
// 초를 시:분:초 형식으로 변환
export const formatTime = (sec: number) => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
};

export const formatElapsedTime = (elapsedSec: number) => {
  const m = Math.floor(elapsedSec / 60);
  const s = elapsedSec % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(m)}:${pad(s)}`;
};

//F이면 여성, M이면 남성
export const formatGender = (gender: string) => {
  switch (gender) {
    case 'F':
      return '여성';
    case 'M':
      return '남성';
    default:
      return '알 수 없음';
  }
};
