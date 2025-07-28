import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TrackPlayer from 'react-native-track-player';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setupPlayer} from './src/utils/trackPlayerUtil';
import {RecoilRoot} from 'recoil';

import MainScreen from './src/screens/MainScreen';
import LoginScreen from './src/screens/LoginScreen';
import StatisticsScreen from './src/screens/StatisticsScreen';
import CharacterScreen from './src/screens/CharacterScreen';
import CommunityScreen from './src/screens/CommunityScreen';
import RunningScreen from './src/screens/RunningScreen';
import MyPageScreen from './src/screens/MyPageScreen';
import TestScreen from './src/screens/TestScreen';
import ResultScreen from './src/screens/ResultScreen';
import WriteScreen from './src/screens/WriteScreen';
import HealthRoadScreen from './src/screens/HealthRoadScreen';
import ActivitiesScreen from './src/screens/HistoryScreen';
import Result2Screen from './src/screens/Result2Screen';
import SignUpScreen from './src/screens/SignUpScreen';
import OnboardingScreen from './src/screens/OnboardingScreen'; // 튜토리얼 화면 추가
import DebugResetScreen from './src/screens/DebugResetScreen';

TrackPlayer.registerPlaybackService(
  () => require('./src/utils/TrackPlayerService').default,
);

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    setupPlayer();

    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        if (hasLaunched === null) {
          await AsyncStorage.setItem('hasLaunched', 'true');
          setShowOnboarding(true);
        } else {
          setShowOnboarding(false);
        }
      } catch (e) {
        console.error('온보딩 체크 실패:', e);
        setShowOnboarding(false);
      }
    };

    checkFirstLaunch();
  }, []);

  if (showOnboarding === null) {
    return <></>;
  } // 로딩 중

  return (
    <RecoilRoot>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={showOnboarding ? 'Onboarding' : 'Login'}
          screenOptions={{headerShown: false, animation: 'none'}}>
          {/* <Stack.Navigator
          initialRouteName="DebugReset" // 임시로 이걸로 바꾸면
          screenOptions={{headerShown: false, animation: 'none'}}> */}
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="Statistics" component={StatisticsScreen} />
          <Stack.Screen name="Character" component={CharacterScreen} />
          <Stack.Screen name="Community" component={CommunityScreen} />
          <Stack.Screen name="Running" component={RunningScreen} />
          <Stack.Screen name="Mypage" component={MyPageScreen} />
          <Stack.Screen name="Result" component={ResultScreen} />
          <Stack.Screen name="Result2" component={Result2Screen} />
          <Stack.Screen name="Write" component={WriteScreen} />
          <Stack.Screen name="HealthRoad" component={HealthRoadScreen} />
          <Stack.Screen name="Activities" component={ActivitiesScreen} />
          <Stack.Screen name="Signup" component={SignUpScreen} />
          <Stack.Screen name="Test" component={TestScreen} />

          <Stack.Screen name="DebugReset" component={DebugResetScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </RecoilRoot>
  );
}

export default App;
