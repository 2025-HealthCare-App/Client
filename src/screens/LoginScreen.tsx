import React from 'react';
import {Button} from 'react-native';
import styled from 'styled-components/native'; // ← RN은 반드시 /native 필요!

const LoginScreen = ({navigation}: {navigation: any}) => {
  return (
    <Wrapper>
      <Button
        title="Go to MainScreen"
        onPress={() => navigation.navigate('Main')}
      />
    </Wrapper>
  );
};

export default LoginScreen;

const Wrapper = styled.View`
  height: 100vh;
  width: 100%;
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
`;
