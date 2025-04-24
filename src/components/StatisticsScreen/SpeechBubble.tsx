import styled from 'styled-components/native';
import React from 'react';

const BalloonWrapper = styled.View`
  height: 100%;
  width: 250px;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: #02adb5;
  border-radius: 10px;
  align-self: flex-start;
  margin-left: 10px; /* 말풍선 꼬리를 위한? 왼쪽 여백 추가 */
  padding: 0px 20px;
`;

const BalloonTail = styled.View`
  position: absolute;
  left: -20px;
  top: 30px;
  width: 0;
  height: 0;
  border-top-width: 5px;
  border-bottom-width: 5px;
  border-right-width: 20px; /* 말풍선 꼬리의 너비 */
  border-style: solid;
  border-top-color: transparent;
  border-bottom-color: transparent;
  border-right-color: #02adb5;
`;

const BalloonText = styled.Text`
  color: white;
  font-size: 12px;
`;

const BoldText = styled(BalloonText)`
  font-weight: bold;
  font-size: 16px;
`;

const SpeechBubble = () => {
  return (
    <BalloonWrapper>
      <BalloonTail />
      <BalloonText>
        지금까지 {'\n'}
        <BoldText>서울역</BoldText>
        에서 <BoldText>강남역</BoldText>
        까지 달렸어요!
      </BalloonText>
    </BalloonWrapper>
  );
};

export default SpeechBubble;
