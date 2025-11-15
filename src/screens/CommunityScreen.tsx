import React, {useCallback, useState} from 'react';
import styled from 'styled-components/native';
import RankingBoard from '../components/communityScreen/RankingBoard';
import WriteButton from '../components/communityScreen/WriteButton';
import PostsContainer from '../components/communityScreen/PostsContainer';
import {checkTodayPost} from '../apis/community/postAPI';
import {useFocusEffect} from '@react-navigation/native';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSetRecoilState} from 'recoil';
import {authState} from '../recoil/authState';

const CommunityScreen = () => {
  const [isPosted, setIsPosted] = useState(false); //이거 기억하게 하기!!TODO
  const setAuthState = useSetRecoilState(authState); // 👈 로그인 상태 변경 함수

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
          Alert.alert(
            '세션 만료',
            '로그인 정보가 만료되었습니다. 다시 로그인 해주세요.',
          );

          // 1. 저장된 토큰을 삭제합니다.
          AsyncStorage.removeItem('token');
          // 2. 전역 로그인 상태를 false로 변경합니다.
          setAuthState({isLoggedIn: false});
        });
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
  background-color: #1a1a1a;
`;
