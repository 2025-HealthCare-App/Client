import React, {useCallback, useEffect, useState} from 'react';
import styled from 'styled-components/native';
import RankingBoard from '../components/communityScreen/RankingBoard';
import WriteButton from '../components/communityScreen/WriteButton';
import PostsContainer from '../components/communityScreen/PostsContainer';
import {checkTodayPost} from '../apis/community/postAPI';
import {useFocusEffect} from '@react-navigation/native';

const CommunityScreen = () => {
  const [isPosted, setIsPosted] = useState(false); //이거 기억하게 하기!!TODO

  // 👇 useEffect를 useFocusEffect로 변경합니다.
  useFocusEffect(
    useCallback(() => {
      // 이 코드는 CommunityScreen이 보일 때마다 실행됩니다.
      console.log('CommunityScreen focused, checking post status...');
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

      // useFocusEffect는 cleanup 함수를 반환할 수 있습니다 (필요시 사용).
      return () => {
        // console.log('CommunityScreen unfocused');
      };
    }, []),
  );

  return (
    //TODO: 무한 스크롤 구현
    <Wrapper>
      <RankingBoard />
      <WriteButton isPosted={isPosted} />
      <PostsContainer />
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
`;
