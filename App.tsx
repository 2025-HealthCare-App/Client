// import React, {useEffect, useState} from 'react';
// import {NavigationContainer} from '@react-navigation/native';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import TrackPlayer from 'react-native-track-player';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {setupPlayer} from './src/utils/trackPlayerUtil';
// import {RecoilRoot} from 'recoil';

// import MainScreen from './src/screens/MainScreen';
// import LoginScreen from './src/screens/LoginScreen';
// import StatisticsScreen from './src/screens/StatisticsScreen';
// import CharacterScreen from './src/screens/CharacterScreen';
// import CommunityScreen from './src/screens/CommunityScreen';
// import RunningScreen from './src/screens/RunningScreen';
// import MyPageScreen from './src/screens/MyPageScreen';
// import TestScreen from './src/screens/TestScreen';
// import ResultScreen from './src/screens/ResultScreen';
// import WriteScreen from './src/screens/WriteScreen';
// import HealthRoadScreen from './src/screens/HealthRoadScreen';
// import HistoryScreen from './src/screens/HistoryScreen';
// import Result2Screen from './src/screens/Result2Screen';
// import OnboardingScreen from './src/screens/OnboardingScreen'; // 튜토리얼 화면 추가
// import DebugResetScreen from './src/screens/DebugResetScreen';
// import RecentPointsScreen from './src/screens/RecentPointsScreen';

// TrackPlayer.registerPlaybackService(
//   () => require('./src/utils/TrackPlayerService').default,
// );

// const Stack = createNativeStackNavigator();

// function App(): React.JSX.Element {
//   const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

//   useEffect(() => {
//     setupPlayer(); // TrackPlayer 초기화

//     const checkFirstLaunch = async () => {
//       try {
//         const hasLaunched = await AsyncStorage.getItem('hasLaunched');
//         if (hasLaunched === null) {
//           await AsyncStorage.setItem('hasLaunched', 'true');
//           setShowOnboarding(true);
//         } else {
//           setShowOnboarding(false);
//         }
//       } catch (e) {
//         console.error('온보딩 체크 실패:', e);
//         setShowOnboarding(false);
//       }
//     };

//     checkFirstLaunch();
//   }, []);

//   if (showOnboarding === null) {
//     return <></>;
//   } // 로딩 중

//   return (
//     <RecoilRoot>
//       <NavigationContainer>
//         <Stack.Navigator
//           initialRouteName={showOnboarding ? 'Onboarding' : 'Login'}
//           screenOptions={{headerShown: false, animation: 'none'}}>
//           {/* <Stack.Navigator
//           initialRouteName="DebugReset" // 임시로 이걸로 바꾸면
//           screenOptions={{headerShown: false, animation: 'none'}}> */}
//           <Stack.Screen name="Login" component={LoginScreen} />
//           <Stack.Screen name="Main" component={MainScreen} />
//           <Stack.Screen name="Statistics" component={StatisticsScreen} />
//           <Stack.Screen name="Character" component={CharacterScreen} />
//           <Stack.Screen name="Community" component={CommunityScreen} />
//           <Stack.Screen name="Running" component={RunningScreen} />
//           <Stack.Screen name="Mypage" component={MyPageScreen} />
//           <Stack.Screen name="Result" component={ResultScreen} />
//           <Stack.Screen name="Result2" component={Result2Screen} />
//           <Stack.Screen name="Write" component={WriteScreen} />
//           <Stack.Screen name="HealthRoad" component={HealthRoadScreen} />
//           <Stack.Screen name="History" component={HistoryScreen} />
//           <Stack.Screen name="RecentPoints" component={RecentPointsScreen} />

//           <Stack.Screen name="Onboarding" component={OnboardingScreen} />
//           <Stack.Screen name="Test" component={TestScreen} />

//           <Stack.Screen name="DebugReset" component={DebugResetScreen} />
//         </Stack.Navigator>
//       </NavigationContainer>
//     </RecoilRoot>
//   );
// }

// export default App;

import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TrackPlayer from 'react-native-track-player';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setupPlayer} from './src/utils/trackPlayerUtil';
import {RecoilRoot} from 'recoil';

// --- 변경점: 필요한 스크린과 네비게이터만 import 합니다. ---
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
// import SignUpScreen from './src/screens/SignUpScreen'; // 회원가입 화면이 있다면 추가
import MainTabNavigator from './src/navigators/MainTabNavigator'; // 우리가 만든 탭 네비게이터
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
  }

  return (
    <RecoilRoot>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={showOnboarding ? 'Onboarding' : 'Login'}
          screenOptions={{headerShown: false, animation: 'none'}}>
          {/* --- 변경점: 로그인 전 플로우만 남깁니다. --- */}
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          {/* <Stack.Screen name="Signup" component={SignUpScreen} /> */}

          {/* --- 변경점: 로그인 후 전체 앱을 담당하는 단 하나의 스크린 --- */}
          <Stack.Screen name="MainApp" component={MainTabNavigator} />

          {/* --- 삭제되는 스크린들 --- */}
          {/* Main, Statistics, Character, Community, Running, Mypage,
            Result, Result2, Write, HealthRoad, History, RecentPoints 등
            로그인 후에만 보이는 모든 화면이 여기서 제거됩니다.
            이들은 각자의 StackNav 파일에서 관리됩니다.
          */}

          <Stack.Screen name="DebugReset" component={DebugResetScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </RecoilRoot>
  );
}

export default App;
