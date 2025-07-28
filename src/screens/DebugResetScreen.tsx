import React from 'react';
import {View, Button, Text, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DebugResetScreen() {
  const clearOnboardingFlag = async () => {
    await AsyncStorage.removeItem('hasLaunched');
    Alert.alert('hasLaunched 제거됨! 앱 재시작 후 Onboarding 다시 나옵니다.');
  };

  return (
    <View>
      <Text>Debug Reset</Text>
      <Button title="온보딩 플래그 초기화" onPress={clearOnboardingFlag} />
    </View>
  );
}
