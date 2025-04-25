import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainScreen from './src/screens/MainScreen';
import LoginScreen from './src/screens/LoginScreen';
import StatisticsScreen from './src/screens/StatisticsScreen';
import CharacterScreen from './src/screens/CharacterScreen';
import CommunityScreen from './src/screens/CommunityScreen';
import RunningScreen from './src/screens/RunningScreen';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Running"
        screenOptions={{headerShown: false, animation: 'none'}}>
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Statistics" component={StatisticsScreen} />
        <Stack.Screen name="Character" component={CharacterScreen} />
        <Stack.Screen name="Community" component={CommunityScreen} />
        <Stack.Screen name="Running" component={RunningScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
