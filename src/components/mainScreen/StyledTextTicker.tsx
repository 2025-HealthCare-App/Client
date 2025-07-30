import React from 'react';
import TextTicker from 'react-native-text-ticker';
import styled from 'styled-components/native';

interface StyledTextTickerProps {
  text: string;
}

const StyledTextTicker = ({text}: StyledTextTickerProps) => {
  // 짧은 글도 무조건 스크롤 되도록 뒤에 공백+복사본 추가
  const scrollText = `${text}     ${text}`;

  return (
    <Wrapper>
      <TextTicker
        style={{
          fontSize: 12,
          color: 'white',
        }}
        duration={8000} // 전체 이동 시간 (느리게 할수록 부드러움)
        loop
        bounce={false}
        scroll={true}
        repeatSpacer={50} // 문장 사이 간격
        marqueeDelay={0}
        numberOfLines={1} // 1줄 강제
        isInteraction={false} // 터치해도 멈추지 않게
      >
        {scrollText}
      </TextTicker>
    </Wrapper>
  );
};

export default StyledTextTicker;

const Wrapper = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
