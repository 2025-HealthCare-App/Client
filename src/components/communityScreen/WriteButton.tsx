import {useNavigation} from '@react-navigation/native';
import React from 'react';
import styled from 'styled-components/native';

interface WriteButtonProps {
  isPosted: boolean;
}

const WriteButton = ({isPosted}: WriteButtonProps) => {
  const navigation = useNavigation();
  const handlePress = () => {
    if (isPosted) {
      return; // 이미 게시글을 작성한 경우 아무 동작도 하지 않음
    }
    // 게시글 작성 화면으로 이동
    navigation.navigate('Write');
  };

  return (
    <Wrapper onPress={handlePress} isPosted={isPosted}>
      <PencilIcon source={require('../../images/pencil.png')} />
      {isPosted ? (
        <WriteText isPosted={isPosted}>오늘의 게시글 작성 완료</WriteText>
      ) : (
        <WriteText isPosted={isPosted}>게시글 작성하기(+500P)</WriteText>
      )}
    </Wrapper>
  );
};

export default WriteButton;

const Wrapper = styled.TouchableOpacity<{isPosted: boolean}>`
  padding: 14px 15px;
  border-radius: 10px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${({isPosted}) => (isPosted ? '#656a00' : '#c0ca00')};
  border: 2px solid ${({isPosted}) => (isPosted ? '#b3b3b3' : '#ffffff')};
  margin-top: 20px;
  margin-bottom: 25px;
  gap: 5px;
`;

const PencilIcon = styled.Image`
  width: 17px;
  height: 17px;
`;

const WriteText = styled.Text<{isPosted: boolean}>`
  font-size: 12px;
  font-weight: bold;
  color: ${({isPosted}) => (isPosted ? '#b3b3b3' : '#ffffff')};
`;
