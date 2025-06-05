import React, {useState} from 'react';
import {Text, Touchable, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';

const Post = () => {
  const [isHearted, setIsHearted] = useState(false);
  const [heartCount, setHeartCount] = useState(34);
  return (
    <Wrapper>
      {/* <Title>나는야 초보</Title> */}
      <PostImage
        source={require('../../images/communityScreen/workdone.png')}
      />
      <HeartContainer>
        <TouchableOpacity
          onPress={() => {
            setIsHearted(!isHearted);
            setHeartCount(isHearted ? heartCount - 1 : heartCount + 1);
          }}>
          <HeartIcon
            source={
              isHearted
                ? require('../../images/communityScreen/heart-filled.png')
                : require('../../images/communityScreen/heart-empty.png')
            }
          />
        </TouchableOpacity>
        <HeartCount>{heartCount}</HeartCount>
      </HeartContainer>
      <PostTextContainer>
        <NameAndDate>
          <UserName>
            <Text>나는야초보</Text>
            <TierBadge source={require('../../images/tierBadge.png')} />
          </UserName>
          <Date>2025.10.01</Date>
        </NameAndDate>
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
const NameAndDate = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
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
`;

const PostTextContainer = styled.View`
  width: 100%;
`;
const UserName = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #ffffff;
  flex-direction: row;
`;
const Date = styled.Text`
  font-size: 12px;
  color: #6d7c91;
`;
const PostText = styled.Text`
  font-size: 13px;
  color: #ffffff;
`;
const TierBadge = styled.Image`
  height: 20px;
  width: 20px;
  margin-left: 5px;
`;
