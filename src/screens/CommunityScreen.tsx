import React from 'react';
import styled from 'styled-components/native';
import BottomBar from '../components/common/BottomBar';
import RankingBoard from '../components/communityScreen/RankingBoard';

const CommunityScreen = () => {
  return (
    <Wrapper>
      <RankingBoard />

      <BottomBar />
    </Wrapper>
  );
};

export default CommunityScreen;

const Wrapper = styled.View`
  height: 100%;
  justify-content: flex-start;
  align-items: center;
  background-color: #222831;
  padding-bottom: 60px; /* bottomBar 높이만큼 여백 추가 */
`;
