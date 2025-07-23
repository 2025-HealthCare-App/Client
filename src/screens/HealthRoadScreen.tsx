import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import BottomBar from '../components/common/BottomBar';

const HealthRoadScreen = () => {
  const navigation = useNavigation();

  //before버튼 누르면 communityScreen으로 이동
  const handleBeforeButtonPress = () => {
    navigation.navigate('Character');
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
          source={require('../images/characterScreen/health-road.png')}
          resizeMode="contain"
        />
      </Main>
      <BottomBar />
    </Wrapper>
  );
};

export default HealthRoadScreen;

const Wrapper = styled.View`
  height: 100%;
  justify-content: flex-start;
  align-items: center;
  background-color: #222831;
  padding-bottom: 70px; /* bottomBar 높이만큼 여백 추가 */
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
