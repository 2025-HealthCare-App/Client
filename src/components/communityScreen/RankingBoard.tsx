import React from 'react';
import styled from 'styled-components/native';
import Profile from './Profile';
import {Text} from 'react-native';

const RankingBoard = () => {
  const profileImages = {
    // 이미지 경로를 객체로 관리
    profileImg1: require('../../images/profileImgs/profileImg1.jpg'),
    profileImg2: require('../../images/profileImgs/profileImg2.png'),
    profileImg3: require('../../images/profileImgs/profileImg3.png'),
  };

  return (
    <>
      <Wrapper>
        <Title>이번주 실시간 랭킹</Title>
        <ProfilesContainer>
          <Profile
            name="작심삼일"
            km={71}
            imgSrc={profileImages.profileImg1} // 실제 이미지 객체 전달
          />
          <Profile
            name="나는야초보"
            km={124}
            imgSrc={profileImages.profileImg2} // 실제 이미지 객체 전달
          />
          <Profile
            name="달리기하자"
            km={97}
            imgSrc={profileImages.profileImg3} // 실제 이미지 객체 전달
          />
        </ProfilesContainer>
        <PercentText>
          <UserName>나는야초보</UserName>
          <Text> 님은 현재 </Text>
          <Percent>상위 12%</Percent>
          <Text>에 있어요!</Text>
        </PercentText>
      </Wrapper>
    </>
  );
};

export default RankingBoard;

const Wrapper = styled.View`
  width: 100%;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  justify-content: flex-start;
  align-items: center;
  background-color: #393e46;
  padding: 30px 20px;
  gap: 30px;
`;
const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
  width: 100%;
`;

const ProfilesContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 30px;
`;

const PercentText = styled.Text`
  font-size: 15px;
  color: #ffffff;
  margin-top: 10px;
  text-align: center;
  width: 100%;
`;
const UserName = styled.Text`
  font-weight: bold;
  color: #00adb5;
  font-size: 18px;
  font-weight: bold;
  text-decoration-line: underline;
`;
const Percent = styled.Text`
  font-weight: bold;
  font-size: 17px;
  font-weight: bold;
  text-decoration-line: underline;
`;
