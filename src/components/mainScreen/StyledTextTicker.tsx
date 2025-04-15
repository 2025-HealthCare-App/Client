import React from 'react';
import TextTicker from 'react-native-text-ticker';
import styled from 'styled-components/native';

const StyledTextTicker = () => {
  return (
    <Wrapper>
      <TextTicker
        style={{
          fontSize: 12,
          color: 'white',
          width: '100%',
          textAlign: 'center',
        }}
        duration={5000}
        loop
        bounce={false}
        repeatSpacer={0}
        marqueeDelay={0}>
        이번주 목표를 달성할 수 있을까요? 오늘도 함께 달려요! 이번주 목표를
        달성할 수 있을까요? 오늘도 함께 달려요!
      </TextTicker>
    </Wrapper>
  );
};

export default StyledTextTicker;

const Wrapper = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
`;
