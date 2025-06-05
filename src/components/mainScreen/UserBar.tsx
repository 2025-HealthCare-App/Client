import React from 'react';
import {Image} from 'react-native';
import styled from 'styled-components/native';

const UserBar = () => {
  return (
    <Wrapper>
      <UserInfoContainer>
        <ProfileImg
          source={require('../../images/profileImgs/profileImg1.jpg')}
        />
        <TierBadge source={require('../../images/tierBadge.png')} />
        <UserName>나는야초보</UserName>
      </UserInfoContainer>
      <PointContainer>
        <Image
          source={require('../../images/point.png')}
          style={{width: 30, height: 30, marginRight: -15, zIndex: 999}}
        />
        <PointTextContainer>
          <PointText>1,200 P</PointText>
        </PointTextContainer>
      </PointContainer>
      <QuestContainer>
        <Image
          source={require('../../images/quest.png')}
          style={{width: 25, height: 25, zIndex: 999}}
        />
      </QuestContainer>
    </Wrapper>
  );
};

export default UserBar;

const Wrapper = styled.View`
  width: 100%;
  height: 70px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const UserInfoContainer = styled.View`
  width: 200px;
  height: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #00494d;
  border: 3px solid #02adb5;
  border-radius: 50px;
  padding: 5px 10px;
`;

const PointContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;
const PointTextContainer = styled.View`
  width: 100px;
  height: 30px;
  background-color: #00494d;
  border: 3px solid #02adb5;
  border-radius: 50px;
  justify-content: center;
  align-items: center;
`;
const PointText = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: white;
  font-family: 'Pretendard';
`;

const ProfileImg = styled(Image)`
  width: 50px;
  height: 50px;
  border-radius: 50px;
`;
const TierBadge = styled(Image)`
  width: 30px;
  height: 30px;
`;
const UserName = styled.Text`
  font-size: 15px;
  color: #ffffff;
  font-weight: bold;
  font-family: 'Pretendard';
  /* TODO: 여기서 글자수 제한 !! */
`;

const QuestContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;
