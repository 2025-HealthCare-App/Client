import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RecoilRoot, useRecoilState} from 'recoil';
import {authState} from './src/recoil/authState';
import {setupPlayer} from './src/utils/trackPlayerUtil';

import LoginScreen from './src/screens/LoginScreen';
import MainTabNavigator from './src/navigators/MainTabNavigator';
import {View, ActivityIndicator} from 'react-native'; // 로딩 화면을 위해 추가

const Stack = createNativeStackNavigator();

// 실제 네비게이션 로직을 별도 컴포넌트로 분리
function AppNavigator() {
  const [auth, setAuth] = useRecoilState(authState);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // 앱 시작 시 토큰 확인
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          // 토큰이 있으면 로그인 상태로 변경
          setAuth({isLoggedIn: true});
        }
      } catch (e) {
        console.error('토큰 확인 실패:', e);
      } finally {
        // 확인이 끝나면 로딩 상태 해제
        setIsChecking(false);
      }
    };

    checkToken();
    setupPlayer();
  }, []);

  // 토큰을 확인하는 동안 로딩 화면을 보여줍니다.
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
          // 로그인 상태이면 MainApp 화면만 보여줌
          <Stack.Screen name="MainApp" component={MainTabNavigator} />
        ) : (
          // 로그아웃 상태이면 Login 화면만 보여줌
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// 최종 App 컴포넌트는 RecoilRoot로 감싸기만 합니다.
function App(): React.JSX.Element {
  return (
    <RecoilRoot>
      <AppNavigator />
    </RecoilRoot>
  );
}

export default App;
