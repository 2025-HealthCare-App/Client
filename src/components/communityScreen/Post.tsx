import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import {PostType} from '../../types/postType';
import {likePost} from '../../apis/community/postAPI';

type Props = {
  post: PostType;
};

const Post = ({post}: Props) => {
  const [isHearted, setIsHearted] = useState(post.liked);
  const [heartCount, setHeartCount] = useState(post.heartsNum);

  // 하트 클릭 핸들러
  const handleHeartPress = () => {
    //하트 숫자 증가 API 호출
    likePost(post.postId)
      .then(response => {
        if (response.success) {
          console.log('하트 업데이트 성공:', response.message);
          // 하트 상태 업데이트
          setIsHearted(!isHearted);
          setHeartCount(prev => (isHearted ? prev - 1 : prev + 1));
        } else {
          console.error('하트 업데이트 실패:', response.message);
        }
      })
      .catch(error => {
        console.error('하트 업데이트 중 오류 발생:', error);
      });
  };

  useEffect(() => {
    // 초기 하트 상태 설정
    // post.liked가 변경될 때마다 isHearted 상태 업데이트
    setIsHearted(post.liked);
  }, [post.liked]);

  return (
    <Wrapper>
      {/* 게시물 이미지 */}
      <PostImage
        source={
          post.postImage
            ? {uri: post.postImage}
            : require('../../images/communityScreen/workdone.png')
        }
      />

      {/* 하트 */}
      <HeartContainer>
        <TouchableOpacity
          onPress={() => {
            handleHeartPress();
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

      {/* 텍스트 영역 */}
      <PostTextContainer>
        <NameAndDate>
          <UserName>
            <Text>User {post.Uid}</Text>
            <TierBadge source={require('../../images/tierBadge.png')} />
          </UserName>
          <Date>{post.createdAt.split('T')[0]}</Date>
        </NameAndDate>
        <PostText>{post.postContent}</PostText>
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
