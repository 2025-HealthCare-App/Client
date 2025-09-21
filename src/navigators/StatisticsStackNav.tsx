import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Result2Screen from '../screens/Result2Screen';
import StatisticsScreen from '../screens/StatisticsScreen';

const Stack = createNativeStackNavigator();
const StatissticsStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {/* 기본 */}
      <Stack.Screen name="Statistics" component={StatisticsScreen} />

      <Stack.Screen name="Result2" component={Result2Screen} />
    </Stack.Navigator>
  );
};

export default StatissticsStackNavigator;
