import React from 'react';
import {TouchableOpacity} from 'react-native'; // ✅ 이거 꼭 필요!
import styled from 'styled-components/native';

const MainScreen = ({navigation}: {navigation: any}) => {
  return (
    <Wrapper>
      <MainButton onPress={() => navigation.navigate('Login')}>
        <ButtonText>Go to Login</ButtonText>
      </MainButton>
    </Wrapper>
  );
};

export default MainScreen;

const Wrapper = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
`;

const MainButton = styled(TouchableOpacity)`
  background-color: #000000;
  padding: 10px;
  border-radius: 5px;
  margin: 10px;
  width: 120px;
`;

const ButtonText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
`;
