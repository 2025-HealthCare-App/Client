// OnboardingScreen.tsx
import {useNavigation, NavigationProp} from '@react-navigation/native';
import React from 'react';
import {View, Text, Button} from 'react-native';

// Replace 'RootStackParamList' with your actual stack param list type
type RootStackParamList = {
  Login: undefined;
  // ... other routes
};

const OnboardingScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const handleFinish = () => {
    navigation.navigate('Login'); // 로그인으로
  };

  return (
    <View>
      <Text>튜토리얼 화면</Text>
      <Button title="시작하기" onPress={handleFinish} />
    </View>
  );
};

export default OnboardingScreen;
