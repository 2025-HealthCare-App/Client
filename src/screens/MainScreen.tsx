import React from 'react';
import {Image} from 'react-native'; // ✅ 이거 꼭 필요!
import styled from 'styled-components/native';
import UserBar from '../components/mainScreen/UserBar';

const MainScreen = ({navigation}: {navigation: any}) => {
  return (
    <Wrapper>
      <UserBar />
    </Wrapper>
  );
};

export default MainScreen;

const Wrapper = styled.View`
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  background-color: #222831;
  padding: 20px 20px;
`;
