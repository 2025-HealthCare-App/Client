import {useNavigation, useRoute} from '@react-navigation/native';
import React from 'react';
import {Image} from 'react-native';
import styled from 'styled-components/native';

const BottomBar = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const handleNavigation = (screen: string) => {
    navigation.navigate(screen as never);
  };

  // 탭 정보 배열
  const tabs = [
    {
      screen: 'Main',
      label: '홈',
      icon: require('../../images/navigation-icons/HomeIcon.png'),
    },
    {
      screen: 'Statistics',
      label: '통계',
      icon: require('../../images/navigation-icons/StatisticsIcon.png'),
    },
    {
      screen: 'Activities',
      label: '기록',
      icon: require('../../images/navigation-icons/CalendarIcon.png'),
    },
    {
      screen: 'Character',
      label: '캐릭터',
      icon: require('../../images/navigation-icons/CharacterIcon.png'),
    },
    {
      screen: 'Community',
      label: '커뮤니티',
      icon: require('../../images/navigation-icons/CommunityIcon.png'),
    },
  ];

  return (
    <Wrapper>
      {tabs.map(tab => {
        const isActive = route.name === tab.screen;
        return (
          <Section
            key={tab.screen}
            onPress={() => handleNavigation(tab.screen)}>
            <SectionIcon
              source={tab.icon}
              style={{tintColor: isActive ? '#fff' : '#888'}}
            />
            <SectionText style={{color: isActive ? '#fff' : '#888'}}>
              {tab.label}
            </SectionText>
          </Section>
        );
      })}
    </Wrapper>
  );
};

export default BottomBar;

const Wrapper = styled.View`
  width: 100%;
  height: 63px;
  padding-bottom: 10px;
  padding-top: 15px;
  background-color: #222831;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  /* 맨 밑으로 고정 */
  position: absolute;
  bottom: 0;
`;

const Section = styled.TouchableOpacity`
  width: 20%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
`;
const SectionIcon = styled(Image)`
  /* width: 20px;
  height: 20px; */
  width: 24px;
  height: 24px;
  resize-mode: contain;
  max-width: 100%;
  max-height: 100%;

  flex: 1;
  object-fit: contain;
  object-position: center;
`;
const SectionText = styled.Text`
  color: #ffffff;
  font-size: 9px;
`;
