import React from 'react';
import styled from 'styled-components/native';
import HealthRoadContainer from './HealthRoadContainer';
import TextBubble from './TextBubble';
import {userInfoAtom} from '../../recoil/atom';
import {useRecoilState} from 'recoil';
import {getCharacterMessage} from '../../constants/characterMsg';
import {
  getCharacterImageSource,
  getPointsForNextLevel,
  levelUp,
} from '../../utils/characterUtil';
import {addComma} from '../../utils/util';

const CharacterContents = () => {
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);

  // 버튼 비활성화 조건: 최대 레벨이거나 포인트 부족
  const isButtonDisabled =
    userInfo?.level === 5 ||
    typeof userInfo?.points !== 'number' ||
    userInfo?.points < Number(getPointsForNextLevel(userInfo?.level));

  //레벨업 후, 새로고침 하지 않아도 변경된 레벨과 포인트를 반영하기 위해
  const handleLevelUp = (newLevel: number, newPoints: number) => {
    setUserInfo(prevState => ({
      ...prevState,
      level: newLevel,
      points: newPoints,
    }));
  };

  return (
    <Wrapper>
      <HealthRoadContainer />
      <TextBubble text={getCharacterMessage(userInfo?.level)} />
      <Character>
        <Name>Lv.{userInfo?.level ?? 1}</Name>
        <CharacterImage source={getCharacterImageSource(userInfo?.level)} />
      </Character>
      <LvUpContainer>
        <LvUpButton
          disabled={isButtonDisabled}
          isDisabled={isButtonDisabled}
          onPress={() => {
            levelUp(userInfo?.points, userInfo?.level);
            handleLevelUp(
              userInfo?.level + 1,
              userInfo?.points - Number(getPointsForNextLevel(userInfo?.level)),
            );
          }}>
          <LVUpButtonText isDisabled={isButtonDisabled}>
            {userInfo?.level === 5
              ? 'Max Level'
              : isButtonDisabled
              ? '포인트가 부족해요'
              : 'Level UP !'}
          </LVUpButtonText>
        </LvUpButton>
        <PointText>
          {userInfo?.points?.toLocaleString()} /{' '}
          {addComma(getPointsForNextLevel(userInfo?.level))} P
        </PointText>
      </LvUpContainer>
    </Wrapper>
  );
};

export default CharacterContents;

const Wrapper = styled.View`
  width: 95%;
  height: 100%;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: #393939;
  border-radius: 18px;
  padding: 20px 20px;
  font-family: 'Pretendard';
`;

const Character = styled.View`
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;
const Name = styled.Text`
  font-size: 12px;
  color: #ffffff;
  font-family: 'Pretendard';
  margin-left: 10px;
`;
const CharacterImage = styled.Image`
  width: 250px;
  height: 250px;
`;

const LvUpContainer = styled.View`
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;
const LvUpButton = styled.TouchableOpacity<{isDisabled: boolean}>`
  width: 150px;
  height: 50px;
  background-color: ${({isDisabled}) => (isDisabled ? '#09804d' : '#17db86')};
  border: 3px solid ${({isDisabled}) => (isDisabled ? '#0da563' : '#0da563')};
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  opacity: ${({isDisabled}) => (isDisabled ? 0.7 : 1)};
`;
const LVUpButtonText = styled.Text<{isDisabled: boolean}>`
  font-size: ${({isDisabled}) => (isDisabled ? '12px' : '16px')};
  color: #ffffff;
  font-family: 'Pretendard';
  font-weight: bold;
  text-align: center;
`;
const PointText = styled.Text`
  font-size: 14px;
  color: #ffffff;
  font-family: 'Pretendard';
  font-weight: bold;
`;
