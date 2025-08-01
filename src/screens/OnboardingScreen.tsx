import {useNavigation, NavigationProp} from '@react-navigation/native';
import React from 'react';
import {ScrollView, Dimensions, View} from 'react-native';
import styled from 'styled-components/native';

type RootStackParamList = {
  Login: undefined;
  // ... other routes
};

const onboardingImages = [
  require('../images/onboarding/onboarding_main_1.png'),
  require('../images/onboarding/onboarding_history_1.png'),
  // 필요한 만큼 이미지 추가
];

const {width, height} = Dimensions.get('window');

const OnboardingScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      style={{flex: 1, backgroundColor: '#fff'}}>
      {onboardingImages.map((img, idx) => {
        const isLast = idx === onboardingImages.length - 1;
        return (
          <View key={idx} style={{width, height, position: 'relative'}}>
            <FullImage source={img} />
            {isLast && (
              <StartButtonContainer>
                <StartButton onPress={() => navigation.navigate('Login')}>
                  <StartButtonText>시작하기</StartButtonText>
                </StartButton>
              </StartButtonContainer>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};

export default OnboardingScreen;

const FullImage = styled.Image`
  width: ${Dimensions.get('window').width}px;
  height: ${Dimensions.get('window').height}px;
  resize-mode: cover;
`;

const StartButtonContainer = styled.View`
  position: absolute;
  bottom: 80px;
  width: 100%;
  align-items: center;
`;

const StartButton = styled.TouchableOpacity`
  background-color: #02adb5;
  padding: 16px 48px;
  border-radius: 30px;
`;

const StartButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;
