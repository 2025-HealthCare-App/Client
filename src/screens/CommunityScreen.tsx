import React from 'react';
import styled from 'styled-components/native';
import BottomBar from '../components/common/BottomBar';
import RankingBoard from '../components/communityScreen/RankingBoard';
import WriteButton from '../components/communityScreen/WriteButton';
import PostsContainer from '../components/communityScreen/PostsContainer';

const CommunityScreen = () => {
  return (
    <Wrapper>
      <RankingBoard />
      <WriteButton />
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
  padding: 0px 20px;
  padding-bottom: 60px; /* bottomBar 높이만큼 여백 추가 */
`;
