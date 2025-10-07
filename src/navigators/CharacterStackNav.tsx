import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CharacterScreen from '../screens/CharacterScreen';
import HealthRoadScreen from '../screens/HealthRoadScreen';
import RecentPointsScreen from '../screens/RecentPointsScreen';
import MyPageScreen from '../screens/MyPageScreen';

const Stack = createNativeStackNavigator();
const CharacterStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {/* 기본 */}
      <Stack.Screen name="CharacterScreen" component={CharacterScreen} />
      <Stack.Screen name="Mypage" component={MyPageScreen} />
      <Stack.Screen name="HealthRoad" component={HealthRoadScreen} />
      <Stack.Screen name="RecentPoints" component={RecentPointsScreen} />
    </Stack.Navigator>
  );
};

export default CharacterStackNavigator;
