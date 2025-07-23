import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import BottomBar from '../components/common/BottomBar';
import RankingBoard from '../components/communityScreen/RankingBoard';
import WriteButton from '../components/communityScreen/WriteButton';
import PostsContainer from '../components/communityScreen/PostsContainer';
import {checkTodayPost} from '../apis/community/postAPI';

const CommunityScreen = () => {
  const [isPosted, setIsPosted] = useState(false); //이거 기억하게 하기!!TODO

  useEffect(() => {
    //오늘의 게시글 작성 여부 확인 API 호출
    checkTodayPost()
      .then(data => {
        if (data.success) {
          setIsPosted(data.alreadyPosted);
        } else {
          console.error('오늘의 게시글 작성 여부 확인 실패:', data.message);
        }
      })
      .catch(error => {
        console.error('오늘의 게시글 작성 여부 확인 중 오류 발생:', error);
      });
  }, []);

  return (
    //TODO: 무한 스크롤 구현
    <Wrapper>
      <RankingBoard />
      <WriteButton isPosted={isPosted} setIsPosted={setIsPosted} />
      <PostsContainer />
      <BottomBar />
    </Wrapper>
  );
};

export default CommunityScreen;

const Wrapper = styled.View`
  width: 100%;
  height: 100%;
  justify-content: flex-start;
  align-items: center;
  background-color: #222831;
  padding-bottom: 60px; /* bottomBar 높이만큼 여백 추가 */
`;
