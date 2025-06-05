import React, {useRef, useState} from 'react';
import styled from 'styled-components/native';
import Profile from './Profile';
import {Text, Animated, TouchableOpacity} from 'react-native';

const RankingBoard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const animatedHeight = useRef(new Animated.Value(1)).current; // 1 = 펼쳐진 상태

  const profileImages = {
    // 이미지 경로를 객체로 관리
    profileImg1: require('../../images/profileImgs/profileImg1.jpg'),
    profileImg2: require('../../images/profileImgs/profileImg2.png'),
    profileImg3: require('../../images/profileImgs/profileImg3.png'),
  };

  const toggleRankingBoard = () => {
    const toValue = isCollapsed ? 1 : 0; // 0 = 접힌 상태

    Animated.timing(animatedHeight, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setIsCollapsed(!isCollapsed);
  };

  return (
    <Animated.View
      style={{
        width: '100%',
        height: animatedHeight.interpolate({
          inputRange: [0, 1],
          outputRange: [80, 320], // 접힌 높이 80px, 펼친 높이 320px
        }),
        overflow: 'hidden',
      }}>
      <Wrapper>
        <TitleContainer>
          <Title>이번주 실시간 랭킹</Title>
          <ToggleButton onPress={toggleRankingBoard}>
            <ToggleText>{isCollapsed ? '▼' : '▲'}</ToggleText>
          </ToggleButton>
        </TitleContainer>

        <ProfilesContainer>
          <Profile
            name="작심삼일"
            km={71}
            imgSrc={profileImages.profileImg1} // 실제 이미지 객체 전달
            isSecond={true} // 2등 표시
          />
          <Profile
            name="나는야초보"
            km={124}
            imgSrc={profileImages.profileImg2} // 실제 이미지 객체 전달
            isFirst={true} // 1등 표시
          />
          <Profile
            name="달리기하자"
            km={97}
            imgSrc={profileImages.profileImg3} // 실제 이미지 객체 전달
            isThird={true} // 3등 표시
          />
        </ProfilesContainer>

        <PercentText>
          <UserName>나는야초보</UserName>
          <Text> 님은 현재 </Text>
          <Percent>상위 12%</Percent>
          <Text>에 있어요!</Text>
        </PercentText>
      </Wrapper>
    </Animated.View>
  );
};

export default RankingBoard;

const Wrapper = styled.View`
  width: 100%;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  justify-content: flex-start;
  align-items: center;
  background-color: #393e46;
  padding: 30px 20px;
  gap: 15px;
`;

const TitleContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #ffffff;
  text-align: left;
`;

const ToggleButton = styled(TouchableOpacity)`
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 15px;
  padding: 6px 10px;
`;

const ToggleText = styled.Text`
  color: #ffffff;
  font-size: 14px;
  font-weight: bold;
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
  font-size: 19px;
  font-weight: bold;
  text-decoration-line: underline;
`;

const Percent = styled.Text`
  font-weight: bold;
  font-size: 17px;
  font-weight: bold;
  text-decoration-line: underline;
`;
