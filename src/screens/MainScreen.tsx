import React from 'react';
import {Button} from 'react-native';
import styled from 'styled-components/native'; // ← RN은 반드시 /native 필요!

const MainScreen = ({navigation}: {navigation: any}) => {
  return (
    <Wrapper>
      <Button
        title="Go to LoginScreen"
        onPress={() => navigation.navigate('Login')}
      />
    </Wrapper>
  );
};

export default MainScreen;

const Wrapper = styled.View`
  height: 100vh;
  width: 100%;
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
`;
