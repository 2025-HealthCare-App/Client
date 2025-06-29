import React, {useState} from 'react';
import styled from 'styled-components/native';
import BottomBar from '../components/common/BottomBar';
import RankingBoard from '../components/communityScreen/RankingBoard';
import WriteButton from '../components/communityScreen/WriteButton';
import PostsContainer from '../components/communityScreen/PostsContainer';

const CommunityScreen = () => {
  const [isPosted, setIsPosted] = useState(false);

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
