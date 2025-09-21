import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image} from 'react-native';

import BottomBar from '../components/common/BottomBar';
import MainStackNavigator from './MainStackNav';
import StatissticsStackNavigator from './StatisticsStackNav';
import HistoryStackNavigator from './HistoryStackNav';
import CharacterStackNavigator from './CharacterStackNav';
import CommunityStackNavigator from './CommunityStackNav';

const Tab = createBottomTabNavigator();

// --- 해결책: 아이콘 컴포넌트를 함수 바깥에 미리 정의합니다. ---
const HomeIcon = ({focused}: {focused: boolean}) => (
  <Image
    source={require('../images/navigation-icons/HomeIcon.png')}
    style={{
      width: 24,
      height: 24,
      tintColor: focused ? '#fff' : '#888',
    }}
  />
);
const StatisticsIcon = ({focused}: {focused: boolean}) => (
  <Image
    source={require('../images/navigation-icons/StatisticsIcon.png')}
    style={{
      width: 24,
      height: 24,
      tintColor: focused ? '#fff' : '#888',
    }}
  />
);
const HistoryIcon = ({focused}: {focused: boolean}) => (
  <Image
    source={require('../images/navigation-icons/CalendarIcon.png')}
    style={{
      width: 24,
      height: 24,
      tintColor: focused ? '#fff' : '#888',
    }}
  />
);
const CharacterIcon = ({focused}: {focused: boolean}) => (
  <Image
    source={require('../images/navigation-icons/CharacterIcon.png')}
    style={{
      width: 24,
      height: 24,
      tintColor: focused ? '#fff' : '#888',
    }}
  />
);
const CommunityIcon = ({focused}: {focused: boolean}) => (
  <Image
    source={require('../images/navigation-icons/CommunityIcon.png')}
    style={{
      width: 24,
      height: 24,
      tintColor: focused ? '#fff' : '#888',
    }}
  />
);
// --- 여기까지 아이콘 컴포넌트 정의 ---

function MainTabNavigator() {
  return (
    <Tab.Navigator tabBar={BottomBar} screenOptions={{headerShown: false}}>
      <Tab.Screen
        name="Main"
        component={MainStackNavigator}
        options={{
          tabBarLabel: '홈',
          // ✅ 화살표 함수 대신 미리 정의한 컴포넌트를 전달합니다.
          tabBarIcon: HomeIcon,
        }}
      />
      <Tab.Screen
        name="Statistics"
        component={StatissticsStackNavigator}
        options={{
          tabBarLabel: '통계',
          tabBarIcon: StatisticsIcon,
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryStackNavigator}
        options={{
          tabBarLabel: '기록',
          tabBarIcon: HistoryIcon,
        }}
      />
      <Tab.Screen
        name="Character"
        component={CharacterStackNavigator}
        options={{
          tabBarLabel: '캐릭터',
          tabBarIcon: CharacterIcon,
        }}
      />
      <Tab.Screen
        name="Community"
        component={CommunityStackNavigator}
        options={{
          tabBarLabel: '커뮤니티',
          tabBarIcon: CommunityIcon,
        }}
      />
    </Tab.Navigator>
  );
}

export default MainTabNavigator;
