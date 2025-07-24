const characterMessages: Record<number, string[]> = {
  1: [
    '첫 걸음을 뗐어! 이제 시작해보자!',
    '운동은 꾸준함이 답이래. 오늘도 한 발짝 성장 중!',
    '나는 어떤 모습으로 성장할까?',
  ],
  2: [
    '이제 달리는 게 익숙해졌지? 멋져~!',
    '몸이 점점 가벼워지지 않아?',
    '오늘도 밖으로 나가서 걸어 보자!',
  ],
  3: [
    '이제 제법 프로 러너야!',
    '운동 후 수분 섭취, 잊지 마!',
    '지방은 태우고, 자신감은 올리고!',
  ],
  4: [
    '꾸준함의 힘을 증명 중! 자랑스러워.',
    '걷기 운동은 심혈관계 건강에 큰 도움이 돼.',
    '오늘은 어디까지 가 볼까?',
  ],
  5: [
    '이제 넌 진짜 러너야. 존경해!',
    '운동은 끝이 없는 여정이야. 다음 목표는 뭐야?',
    '너의 달리기가 누군가에게 영감이 되고 있어.\n계속 달려보자!',
  ],
};

// 캐릭터 레벨에 따른 메시지 -> 3개중 하나를 랜덤으로 반환
export const getCharacterMessage = (level: number): string => {
  const messages = characterMessages[level];
  if (!messages) {
    return '';
  }
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
};
