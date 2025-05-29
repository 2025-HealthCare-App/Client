import React from 'react';
import styled from 'styled-components/native';

const WriteButton = () => {
  return (
    <Wrapper>
      <PencilIcon source={require('../../images/pencil.png')} />
      <WriteText>게시글 작성하기(+500P)</WriteText>
    </Wrapper>
  );
};

export default WriteButton;

const Wrapper = styled.View`
  padding: 14px 15px;
  border-radius: 10px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #c0ca00;
  border: 2px solid #ffffff;
  margin-top: 20px;
  gap: 5px;
`;

const PencilIcon = styled.Image`
  width: 17px;
  height: 17px;
`;

const WriteText = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: #ffffff;
`;
