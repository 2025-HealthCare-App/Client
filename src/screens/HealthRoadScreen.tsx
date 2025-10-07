import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {Image, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import {useRecoilValue} from 'recoil';
import {userInfoAtom} from '../recoil/atom';

// Define your stack param list
type RootStackParamList = {
  Character: undefined;
  // add other screens here if needed
};

const HealthRoadScreen = () => {
  const userInfo = useRecoilValue(userInfoAtom);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  //before버튼 누르면 communityScreen으로 이동
  const handleBeforeButtonPress = () => {
    // navigation.navigate('Character');
    navigation.goBack();
  };

  //userInfo.level에 따라서 다른 healthroad 이미지 보여주기
  const getHealthRoadImageSource = (level: number | undefined) => {
    switch (level) {
      case 1:
        return require('../images/healthroads/healthroad_1.png');
      case 2:
        return require('../images/healthroads/healthroad_2.png');
      case 3:
        return require('../images/healthroads/healthroad_3.png');
      case 4:
        return require('../images/healthroads/healthroad_4.png');
      case 5:
        return require('../images/healthroads/healthroad_5.png');
      default:
        return require('../images/healthroads/healthroad_1.png');
    }
  };

  return (
    <Wrapper>
      <Header>
        <TouchableOpacity onPress={handleBeforeButtonPress}>
          <BeforeButtonText>&lt;</BeforeButtonText>
        </TouchableOpacity>
        <HeaderText>건강의 길</HeaderText>
      </Header>
      <Main>
        <HealthRoadImage
          source={getHealthRoadImageSource(userInfo?.level)}
          resizeMode="contain"
        />
      </Main>
    </Wrapper>
  );
};

export default HealthRoadScreen;

const Wrapper = styled.View`
  height: 100%;
  justify-content: flex-start;
  align-items: center;
  background-color: #222831;
  padding-top: 20px;
  gap: 15px;
`;

const Header = styled.View`
  width: 90%;
  height: 7%;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0 10px;
  gap: 10px;
`;
const BeforeButtonText = styled.Text`
  font-size: 20px;
  color: #ffffff;
  font-weight: bold;
`;
const HeaderText = styled.Text`
  font-size: 20px;
  color: #ffffff;
  font-weight: bold;
`;

const Main = styled.View`
  height: 93%;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding-bottom: 30px;
`;

const HealthRoadImage = styled(Image)`
  width: 100%;
  height: 100%;
  resize-mode: contain;
`;
