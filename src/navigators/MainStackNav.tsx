import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import MainScreen from '../screens/MainScreen';
import RunningScreen from '../screens/RunningScreen';
import MyPageScreen from '../screens/MyPageScreen';
import ResultScreen from '../screens/ResultScreen';
import RecentPointsScreen from '../screens/RecentPointsScreen';

const Stack = createNativeStackNavigator();

const MainStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="MainScreen" component={MainScreen} />
      <Stack.Screen name="Running" component={RunningScreen} />
      <Stack.Screen name="Mypage" component={MyPageScreen} />
      <Stack.Screen name="Result" component={ResultScreen} />
      <Stack.Screen name="RecentPoints" component={RecentPointsScreen} />
    </Stack.Navigator>
  );
};

export default MainStackNavigator;
