//천 단위로 콤마 붙이는 함수
export const addComma = (value: number) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
