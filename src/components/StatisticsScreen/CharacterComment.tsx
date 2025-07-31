import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import SpeechBubble from './SpeechBubble';
import {Image} from 'react-native';
import {getMyTotalDistanceAPI} from '../../apis/user/userInfoAPI';
import {convertMetersToKilometers} from '../../utils/distanceUtil';
import {useRecoilValue} from 'recoil';
import {userInfoAtom} from '../../recoil/atom';
import {getCharacterImageSource} from '../../utils/characterUtil';

const CharacterComment = () => {
  const [totalDistance, setTotalDistance] = useState<number>(0);
  const userInfo = useRecoilValue(userInfoAtom);

  // 나의 총 누적 거리 받아오기
  useEffect(() => {
    getMyTotalDistanceAPI()
      .then(response => {
        setTotalDistance(
          //정수로 반올림
          Math.round(convertMetersToKilometers(response.data.totalDistance)),
        );
      })
      .catch(error => {
        console.error('나의 총 누적 거리 가져오기 실패:', error);
      });
  }, []);

  return (
    <Wrapper>
      <CharacterAndKm>
        <CharacterImg source={getCharacterImageSource(userInfo.level)} />
        <KmText>{totalDistance}km</KmText>
      </CharacterAndKm>
      <SpeechBubble />
    </Wrapper>
  );
};

export default CharacterComment;

const Wrapper = styled.View`
  width: 100%;
  height: 70px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 40px;
`;

const CharacterAndKm = styled.View`
  width: 50px;
  height: 100%;
  justify-content: space-between;
  align-items: center;
`;
const CharacterImg = styled(Image)`
  width: 60px;
  height: 60px;
`;
const KmText = styled.Text`
  font-size: 12px;
  color: #ffffff;
  font-weight: bold;
  text-align: center;
`;
