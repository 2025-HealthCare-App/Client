import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TrackPlayer from 'react-native-track-player';
import {setupPlayer} from './src/utils/trackPlayerUtil';
import {RecoilRoot} from 'recoil';

// --- 변경점: 필요한 스크린과 네비게이터만 import 합니다. ---
import LoginScreen from './src/screens/LoginScreen';
// import SignUpScreen from './src/screens/SignUpScreen'; // 회원가입 화면이 있다면 추가
import MainTabNavigator from './src/navigators/MainTabNavigator'; // 우리가 만든 탭 네비게이터
import DebugResetScreen from './src/screens/DebugResetScreen';

TrackPlayer.registerPlaybackService(
  () => require('./src/utils/TrackPlayerService').default,
);

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  useEffect(() => {
    // TrackPlayer 초기화만 남겨둡니다.
    setupPlayer();
  }, []);

  return (
    <RecoilRoot>
      <NavigationContainer>
        <Stack.Navigator
          // initialRouteName을 'Login'으로 고정합니다.
          initialRouteName="Login"
          screenOptions={{headerShown: false, animation: 'none'}}>
          {/* --- 로그인 전 플로우 --- */}
          <Stack.Screen name="Login" component={LoginScreen} />
          {/* <Stack.Screen name="Signup" component={SignUpScreen} /> */}

          {/* --- 로그인 후 전체 앱을 담당하는 단 하나의 스크린 --- */}
          <Stack.Screen name="MainApp" component={MainTabNavigator} />

          <Stack.Screen name="DebugReset" component={DebugResetScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </RecoilRoot>
  );
}

export default App;
