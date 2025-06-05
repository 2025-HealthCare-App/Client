import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image} from 'react-native';
import styled from 'styled-components/native';

const BottomBar = () => {
  const navigation = useNavigation();
  const handleNavigation = (screen: string) => {
    navigation.navigate(screen);
  };

  return (
    <Wrapper>
      <Section onPress={() => handleNavigation('Main')}>
        <SectionIcon
          source={require('../../images/navigation-icons/HomeIcon.png')}
        />
        <SectionText>홈</SectionText>
      </Section>
      <Section onPress={() => handleNavigation('Statistics')}>
        <SectionIcon
          source={require('../../images/navigation-icons/StatisticsIcon.png')}
        />
        <SectionText>통계</SectionText>
      </Section>
      <Section onPress={() => handleNavigation('Activities')}>
        <SectionIcon
          source={require('../../images/navigation-icons/CalendarIcon.png')}
        />
        <SectionText>기록</SectionText>
      </Section>
      <Section onPress={() => handleNavigation('Character')}>
        <SectionIcon
          source={require('../../images/navigation-icons/CharacterIcon.png')}
        />
        <SectionText>캐릭터</SectionText>
      </Section>
      <Section onPress={() => handleNavigation('Community')}>
        <SectionIcon
          source={require('../../images/navigation-icons/CommunityIcon.png')}
        />
        <SectionText>커뮤니티</SectionText>
      </Section>
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
