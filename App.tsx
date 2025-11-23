import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RecoilRoot, useRecoilState} from 'recoil';
import {authState} from './src/recoil/authState';
import {setupPlayer} from './src/utils/trackPlayerUtil';

// ▼▼▼ 1. 라이브러리 Import 추가 ▼▼▼
import BackgroundGeolocation, {
  Location,
  Subscription,
} from 'react-native-background-geolocation';

import LoginScreen from './src/screens/LoginScreen';
import MainTabNavigator from './src/navigators/MainTabNavigator';
import {View, ActivityIndicator, Alert} from 'react-native';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const [auth, setAuth] = useRecoilState(authState);
  const [isChecking, setIsChecking] = useState(true);

  // ▼▼▼ 2. 위치 추적 설정 및 초기화 (새로운 useEffect) ▼▼▼
  useEffect(() => {
    let onLocation: Subscription;
    let onMotionChange: Subscription;
    let onActivityChange: Subscription;
    let onProviderChange: Subscription;

    const initGeolocation = async () => {
      // 2-1. 이벤트 리스너 등록
      onLocation = BackgroundGeolocation.onLocation(
        (location: Location) => {
          console.log('[Location] ', location);
        },
        error => {
          console.log('[Location] ERROR: ', error);
        },
      );

      onMotionChange = BackgroundGeolocation.onMotionChange(event => {
        console.log('[MotionChange] ', event);
      });

      onActivityChange = BackgroundGeolocation.onActivityChange(event => {
        console.log('[ActivityChange] ', event);
      });

      onProviderChange = BackgroundGeolocation.onProviderChange(event => {
        console.log('[ProviderChange] ', event);
      });

      try {
        // 1. 준비만 시킵니다. (이 코드는 권한 팝업을 띄우지 않습니다)
        const state = await BackgroundGeolocation.ready({
          reset: true,
          desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
          distanceFilter: 10,
          stopOnTerminate: false,
          startOnBoot: false, // ★ 앱 켤 때 자동 시작 끄기

          // 권한 설정 (나중에 버튼 누를 때 적용됨)
          locationAuthorizationRequest: 'WhenInUse',
          disableLocationAuthorizationAlert: true, // 자체 팝업 끄기

          notification: {
            title: '위치 추적 중',
            text: '달리기 기록 중입니다.',
            smallIcon: 'ic_notification',
          },
        });

        console.log('- Ready success (대기 모드): ', state);

        // ❌ 기존에 있던 start() 코드는 여기서 싹 지워버리세요!
        // if (!state.enabled) { ... start() ... }  <-- 이거 삭제!
      } catch (e) {
        console.error('- Ready failed: ', e);
      }
    };

    // 2-3. 초기화 함수 호출
    initGeolocation();

    // 2-4. 클린업: 컴포넌트 언마운트 시 리스너 제거
    return () => {
      onLocation?.remove();
      onMotionChange?.remove();
      onActivityChange?.remove();
      onProviderChange?.remove();
    };
  }, []);
  // ▲▲▲ 여기까지 추가됨 ▲▲▲

  useEffect(() => {
    // 앱 시작 시 토큰 확인 (기존 로직)
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          setAuth({isLoggedIn: true});
        }
      } catch (e) {
        console.error('토큰 확인 실패:', e);
        Alert.alert('토큰 확인 실패', '다시 로그인 해주세요.');
        setAuth({isLoggedIn: false});
      } finally {
        setIsChecking(false);
      }
    };

    checkToken();
    setupPlayer();
  }, [setAuth]);

  if (isChecking) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false, animation: 'none'}}>
        {auth.isLoggedIn ? (
          <Stack.Screen name="MainApp" component={MainTabNavigator} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function App(): React.JSX.Element {
  return (
    <RecoilRoot>
      <AppNavigator />
    </RecoilRoot>
  );
}

export default App;
