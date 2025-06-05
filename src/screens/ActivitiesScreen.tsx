import React from 'react';
import styled from 'styled-components/native';
import BottomBar from '../components/common/BottomBar';

const ActivitiesScreen = () => {
  return (
    <Wrapper>
      <BottomBar />
    </Wrapper>
  );
};

export default ActivitiesScreen;

const Wrapper = styled.View`
  height: 100%;
  justify-content: space-between;
  align-items: center;
  background-color: #222831;
  padding: 0px 20px;
  padding-bottom: 60px; /* bottomBar 높이만큼 여백 추가 */
`;
