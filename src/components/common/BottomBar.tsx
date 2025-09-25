import React from 'react';
// 👇 1. StyleSheet를 react-native에서 import 합니다.
import StyleSheet from 'react-native';
import styled from 'styled-components/native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';

const BottomBar = ({state, descriptors, navigation}: BottomTabBarProps) => {
  const focusedRoute = state.routes[state.index];
  const {options} = descriptors[focusedRoute.key];

  // 👇 2. StyleSheet.flatten을 사용하여 tabBarStyle을 안전한 객체 형태로 변환합니다.
  const flatTabBarStyle = StyleSheet.flatten(options.tabBarStyle);

  // 👇 3. 변환된 객체를 사용하여 display 속성을 확인합니다.
  if (flatTabBarStyle && flatTabBarStyle.display === 'none') {
    return null;
  }

  return (
    <Wrapper>
      {state.routes.map((route, index) => {
        // ... (이하 코드는 모두 동일)
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? (options.tabBarLabel as string)
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const icon = options.tabBarIcon
          ? options.tabBarIcon({focused: isFocused, color: '#fff', size: 24})
          : null;

        return (
          <Section key={route.key} onPress={onPress}>
            {icon}
            <SectionText style={{color: isFocused ? '#fff' : '#888'}}>
              {label}
            </SectionText>
          </Section>
        );
      })}
    </Wrapper>
  );
};

export default BottomBar;

// ... (styled-components 코드는 동일)
const Wrapper = styled.View`
  width: 100%;
  height: 63px;
  padding-bottom: 10px;
  padding-top: 15px;
  background-color: #222831;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Section = styled.TouchableOpacity`
  width: 20%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
`;

// SectionIcon 컴포넌트는 이제 사용되지 않으므로 삭제하거나,
// tabBarIcon 내부에서 Image 대신 사용하려면 스타일을 유지할 수 있습니다.
const SectionText = styled.Text`
  color: #ffffff;
  font-size: 9px;
`;
