import React from 'react';
import styled from 'styled-components/native';

interface TextBubbleProps {
  text: string;
}

const TextBubble = ({text}: TextBubbleProps) => {
  return (
    <Wrapper>
      <Bubble>
        <Text>{text}</Text>
      </Bubble>
      <Arrow />
    </Wrapper>
  );
};

export default TextBubble;

const Wrapper = styled.View`
  align-items: center;
  width: 240px;
  margin-top: 30px; //TODO: 조정
`;

const Bubble = styled.View`
  background-color: white;
  padding: 20px 30px;
  border-radius: 10px;
  max-width: 240px;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
`;

const Arrow = styled.View`
  width: 0;
  height: 0;
  border-left-width: 8px;
  border-right-width: 8px;
  border-top-width: 17px;
  border-left-color: transparent;
  border-right-color: transparent;
  border-top-color: white;
  margin-bottom: 10px;
`;

const Text = styled.Text`
  font-size: 13px;
  color: #222831;
  font-family: 'Pretendard';
  /* font-weight: bold; */
`;
