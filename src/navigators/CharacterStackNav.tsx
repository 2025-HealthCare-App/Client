import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CharacterScreen from '../screens/CharacterScreen';
import HealthRoadScreen from '../screens/HealthRoadScreen';

const Stack = createNativeStackNavigator();
const CharacterStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Character" component={CharacterScreen} />
      <Stack.Screen name="HealthRoad" component={HealthRoadScreen} />
    </Stack.Navigator>
  );
};

export default CharacterStackNavigator;
