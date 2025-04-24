import React from 'react';
import styled from 'styled-components/native';
import BottomBar from '../components/common/BottomBar';
import {Text} from 'react-native-svg';

const CharacterScreen = ({navigation}: {navigation: any}) => {
  return (
    <Wrapper>
      <Text>Statisc</Text>
      <BottomBar />
    </Wrapper>
  );
};

export default CharacterScreen;

const Wrapper = styled.View`
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  background-color: #222831;
  padding: 30px 0;
  gap: 15px;
`;
