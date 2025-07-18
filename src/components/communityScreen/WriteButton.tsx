import {useNavigation} from '@react-navigation/native';
import React from 'react';
import styled from 'styled-components/native';

interface WriteButtonProps {
  isPosted: boolean;
  setIsPosted: (isPosted: boolean) => void;
}

const WriteButton = ({isPosted, setIsPosted}: WriteButtonProps) => {
  const navigation = useNavigation();
  const handlePress = () => {
    navigation.navigate('Write');
    if (!isPosted) {
      setIsPosted(true);
    }
  };

  return (
    <Wrapper onPress={handlePress}>
      <PencilIcon source={require('../../images/pencil.png')} />
      {isPosted ? (
        <WriteText>오늘의 게시글 작성 완료</WriteText>
      ) : (
        <WriteText>게시글 작성하기(+500P)</WriteText>
      )}
    </Wrapper>
  );
};

export default WriteButton;

const Wrapper = styled.TouchableOpacity`
  padding: 14px 15px;
  border-radius: 10px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #c0ca00;
  border: 2px solid #ffffff;
  margin-top: 20px;
  margin-bottom: 20px;
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
