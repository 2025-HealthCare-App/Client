import React from 'react';
import styled from 'styled-components/native';

const TextTicker = () => {
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

export default TextTicker;

const Wrapper = styled.View`
  justify-content: center;
  align-items: center;
`;
