import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
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
import {RecoilRoot} from 'recoil';
import SignUpScreen from './src/screens/SignUpScreen';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <RecoilRoot>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Main"
          screenOptions={{headerShown: false, animation: 'none'}}>
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
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
        </Stack.Navigator>
      </NavigationContainer>
    </RecoilRoot>
  );
}

export default App;
