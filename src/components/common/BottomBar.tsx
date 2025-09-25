import React from 'react';
import styled from 'styled-components/native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs'; // 타입 import

// 훅 대신 props를 받도록 수정합니다. (타입은 BottomTabBarProps)
const BottomBar = ({state, descriptors, navigation}: BottomTabBarProps) => {
  // 👇 --- 여기가 핵심 수정 부분입니다 --- 👇
  // 1. 현재 활성화된 라우트(경로) 정보를 가져옵니다.
  const focusedRoute = state.routes[state.index];
  // 2. 해당 라우트의 옵션(tabBarStyle 등)을 가져옵니다.
  const {options} = descriptors[focusedRoute.key];
  const tabBarStyle = options.tabBarStyle;

  // 3. tabBarStyle 옵션에 display: 'none'이 설정되어 있다면,
  //    아무것도 렌더링하지 않고 컴포넌트를 종료합니다(null 반환).
  if (tabBarStyle && tabBarStyle.display === 'none') {
    return null;
  }
  // 🔼 --- 여기까지가 핵심 수정 부분입니다 --- 🔼

  return (
    <Wrapper>
      {state.routes.map((route, index) => {
        // descriptors에서 각 탭의 옵션(이름, 아이콘 등)을 가져옵니다.
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? (options.tabBarLabel as string)
            : options.title !== undefined
            ? options.title
            : route.name;

        // 현재 활성화된 탭인지 확인합니다.
        const isFocused = state.index === index;

        // 탭을 눌렀을 때 실행될 함수
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

        // options.tabBarIcon을 통해 아이콘을 렌더링합니다.
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

// styled-components 부분은 그대로 유지
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
