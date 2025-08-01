import React, {useState} from 'react';
import styled from 'styled-components/native'; // ← RN은 반드시 /native 필요!
import {loginAPI} from '../apis/user/loginAPI';
import {Alert, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  return (
    <Wrapper>
      <Title />
      <LoginWrapper>
        <Row>
          <RowText>아이디</RowText>
          <Input value={username} onChangeText={setUsername} />
        </Row>
        <Row>
          <RowText>비밀번호</RowText>
          <Input
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
        </Row>
        <LoginBtn
          onPress={() => {
            loginAPI(username, password)
              .then(async response => {
                const token = response.token;

                // 토큰 저장
                try {
                  await AsyncStorage.setItem('token', token);
                  console.log('토큰 저장 완료');
                } catch (storageError) {
                  console.error('토큰 저장 중 오류:', storageError);
                }

                // 로그인 성공 후 화면 이동
                navigation.navigate('Main');
              })
              .catch(error => {
                console.error('로그인 실패:', error);
                Alert.alert(
                  '로그인 실패',
                  '아이디 또는 비밀번호가 잘못되었습니다.',
                );
              });
          }}>
          <Text>로그인</Text>
        </LoginBtn>
      </LoginWrapper>
    </Wrapper>
  );
};

export default LoginScreen;

const Wrapper = styled.View`
  height: 100%;
  justify-content: flex-start;
  align-items: center;
  background-color: #222831;
  padding-bottom: 70px; /* bottomBar 높이만큼 여백 추가 */
  padding-top: 20px;
  gap: 15px;
`;

const LoginWrapper = styled.View`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const Title = styled.Text`
  color: #ffffff;
  font-size: 30px;
  font-weight: bold;
`;

const Row = styled.View`
  width: 80%;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

const RowText = styled.Text`
  color: #ffffff;
  font-size: 15px;
  width: 30%;
  font-weight: bold;
`;

const Input = styled.TextInput`
  width: 70%;
  height: 40px;
  background-color: #393e46;
  border-radius: 5px;
  padding: 10px;
  color: #ffffff;
`;

const LoginBtn = styled.TouchableOpacity`
  width: 20%;
  height: 40px;
  margin-top: 20px;
  border-radius: 5px;
  background-color: #00adb5;
  justify-content: center;
  align-items: center;
`;
