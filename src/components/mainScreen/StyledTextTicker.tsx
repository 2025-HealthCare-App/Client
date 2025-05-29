import React from 'react';
import TextTicker from 'react-native-text-ticker';
import styled from 'styled-components/native';

interface StyledTextTickerProps {
  text: string;
}

const StyledTextTicker = ({text}: StyledTextTickerProps) => {
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
        {text}
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
