import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CommunityScreen from '../screens/CommunityScreen';
import WriteScreen from '../screens/WriteScreen';
import RecentPointsScreen from '../screens/RecentPointsScreen';
import MyPageScreen from '../screens/MyPageScreen';

const Stack = createNativeStackNavigator();
const CommunityStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {/* 기본 */}
      <Stack.Screen name="CommunityScreen" component={CommunityScreen} />

      <Stack.Screen name="Write" component={WriteScreen} />
      <Stack.Screen name="RecentPoints" component={RecentPointsScreen} />
      <Stack.Screen name="Mypage" component={MyPageScreen} />
    </Stack.Navigator>
  );
};

export default CommunityStackNavigator;
