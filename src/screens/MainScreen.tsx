import React from 'react';
import {Image} from 'react-native'; // ✅ 이거 꼭 필요!
import styled from 'styled-components/native';

const MainScreen = ({navigation}: {navigation: any}) => {
  return (
    <Wrapper>
      {/* <MainButton onPress={() => navigation.navigate('Login')}>
        <ButtonText>Go to Login</ButtonText>
      </MainButton> */}
      <UserBar>
        <UserInfoContainer>
          <ProfileImg source={require('../../images/profileImg.jpg')} />
          <TierBadge source={require('../../images/tierBadge.png')} />
          <UserName>나는야초보</UserName>
        </UserInfoContainer>
        <PointContainer />
      </UserBar>
    </Wrapper>
  );
};

export default MainScreen;

const Wrapper = styled.View`
  flex: 1;
  justify-content: flex-start;
  padding-top: 20px;
  align-items: center;
  background-color: #222831;
`;

const UserBar = styled.View`
  width: 100%;
  height: 70px;
  /* border-bottom-width: 1px;
  border-bottom-color: #ffffff; */
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
`;

const UserInfoContainer = styled.View`
  width: 50%;
  height: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #00494d;
  border: 3px solid #02adb5;
  border-radius: 50px;
  padding: 5px 10px;
`;

const PointContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ProfileImg = styled(Image)`
  width: 50px;
  height: 50px;
  border-radius: 50px;
  /* border: 1.5px solid #fff; */
`;
const TierBadge = styled(Image)`
  width: 30px;
  height: 30px;
`;
const UserName = styled.Text`
  font-size: 15px;
  color: #ffffff;
  margin-left: 10px;
  font-weight: bold;
`;
