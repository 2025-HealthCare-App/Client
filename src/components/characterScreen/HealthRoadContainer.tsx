import {useNavigation} from '@react-navigation/native';
import React from 'react';
import styled from 'styled-components/native';

const HealthRoadContainer = () => {
  const navigation = useNavigation();

  return (
    <Wrapper>
      <HealthRoadBox onPress={() => navigation.navigate('HealthRoad')}>
        <HealthRoadImage />
        <HealthRoadText>건강의 길</HealthRoadText>
      </HealthRoadBox>
    </Wrapper>
  );
};

export default HealthRoadContainer;

const Wrapper = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

const HealthRoadBox = styled.TouchableOpacity`
  width: 28%;
  height: 37px;
  background-color: #ffb6b6;
  border: 3px solid #ff9292;
  border-radius: 100px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 5px;
`;

const HealthRoadImage = styled.Image.attrs({
  source: require('../../images/characterScreen/health_road_icon.png'),
  resizeMode: 'contain',
  style: {width: 15, height: 15},
})`
  width: 15px;
  height: 15px;
`;

const HealthRoadText = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: #ffffff;
  font-family: 'Pretendard';
  text-align: center;
`;
