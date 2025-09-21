import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HistoryScreen from '../screens/HistoryScreen';
import Result2Screen from '../screens/Result2Screen';

const Stack = createNativeStackNavigator();
const HistoryStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {/* 기본 */}
      <Stack.Screen name="HistoryScreen" component={HistoryScreen} />

      <Stack.Screen name="Result2" component={Result2Screen} />
    </Stack.Navigator>
  );
};

export default HistoryStackNavigator;
