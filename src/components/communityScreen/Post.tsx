import React from 'react';
import styled from 'styled-components/native';

const Post = () => {
  return (
    <Wrapper>
      {/* <Title>나는야 초보</Title> */}
      <PostImage
        source={require('../../images/communityScreen/workdone.png')}
      />
      <HeartContainer>
        <HeartIcon
          source={require('../../images/communityScreen/heart-filled.png')}
        />
        <HeartCount>34</HeartCount>
      </HeartContainer>
      <PostTextContainer>
        <UserName>나는야초보</UserName>
        <PostText>
          오늘도 열심히 운동했습니다! 운동을 시작한지 얼마 되지 않았지만,
          매일매일 조금씩 발전하는 것 같아요 💪
        </PostText>
      </PostTextContainer>
    </Wrapper>
  );
};

export default Post;

const Wrapper = styled.View`
  width: 100%;

  justify-content: center;
  align-items: center;
  border: 1px solid #7890b2;
  border-radius: 10px;
  padding: 10px 20px;
  margin-bottom: 15px;
`;

const Title = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #ffffff;
`;
const PostImage = styled.Image`
  width: 100%;
  height: 300px;
  border-radius: 10px;
  margin-top: 10px;
`;

const HeartContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding-right: 10px;
  margin-top: 5px;
`;
const HeartIcon = styled.Image`
  width: 16px;
  height: 15px;
  margin-right: 5px;
`;
const HeartCount = styled.Text`
  font-size: 13px;
  color: #ffffff;
  font-weight: bold;
  margin-right: 10px;
  margin-top: 2px;
  margin-bottom: 4px;
`;

const PostTextContainer = styled.View`
  width: 100%;
  margin-top: 3px;
`;
const UserName = styled.Text`
  font-size: 14px;

  font-weight: bold;
  color: #ffffff;
`;
const PostText = styled.Text`
  font-size: 13px;
  color: #ffffff;
`;
