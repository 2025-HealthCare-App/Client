import React from 'react';
import {Image, Text} from 'react-native';
import styled from 'styled-components/native';

const BottomBar = () => {
  return (
    <Wrapper>
      <Section>
        <SectionIcon
          source={require('../../images/navigation-icons/HomeIcon.png')}
        />
        <SectionText>홈</SectionText>
      </Section>
      <Section>
        <SectionIcon
          source={require('../../images/navigation-icons/StatisticsIcon.png')}
        />
        <SectionText>통계</SectionText>
      </Section>
      <Section>
        <SectionIcon
          source={require('../../images/navigation-icons/CharacterIcon.png')}
        />
        <SectionText>캐릭터</SectionText>
      </Section>
      <Section>
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
  /* height: 7%; */
  padding: 5px 10px;
  background-color: #222831;
  border-top: 1px solid #ffffff;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  /* 맨 밑으로 고정 */
  position: absolute;
  bottom: 0;
`;

const Section = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
`;
const SectionIcon = styled(Image)`
  width: 20px;
  height: 20px;
  object-fit: contain;
`;
const SectionText = styled.Text`
  color: #ffffff;
  font-size: 9px;
`;
