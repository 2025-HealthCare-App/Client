import styled from 'styled-components/native';
import React, {useState, useEffect} from 'react';
import {getMilestoneMessage} from '../../constants/distanceMsg';
import {getMyTotalDistanceAPI} from '../../apis/user/userInfoAPI';

const BalloonWrapper = styled.View`
  height: 100%;
  width: 250px;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: #0cbd71;
  border-radius: 10px;
  align-self: flex-start;
  margin-left: 10px;
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
  border-right-width: 20px;
  border-style: solid;
  border-top-color: transparent;
  border-bottom-color: transparent;
  border-right-color: #0cbd71;
`;

const BalloonText = styled.Text`
  color: white;
  font-size: 12px;
  text-align: center;
`;

const BoldText = styled(BalloonText)`
  font-size: 13px;
  text-align: left;
`;

const SpeechBubble = () => {
  const [totalDistance, setTotalDistance] = useState(40000); // 예시: 40,000m (서울역 ~ 용인)
  useEffect(() => {
    // console.log(JSON.stringify(recentExercises, null, 2)); // JSON 형태로 출력
    getMyTotalDistanceAPI()
      .then(response => {
        setTotalDistance(response.data.totalDistance); // m단위 그대로 사용
      })
      .catch(error => {
        console.error('나의 총 거리 가져오기 실패:', error);
      });
  }, []);

  return (
    <BalloonWrapper>
      <BalloonTail />
      <BoldText>{getMilestoneMessage(totalDistance)}</BoldText>
    </BalloonWrapper>
  );
};

export default SpeechBubble;
