import React, {useState} from 'react';
import {Image, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import LevelModal from '../components/mypageScreen/LevelModal';
import {useNavigation} from '@react-navigation/native';

const MyPageScreen = () => {
  const [modalVisible, setModalVisible] = useState(false); // 모달 상태 추가
  const navigation = useNavigation();
  const goBack = () => {
    navigation.goBack();
  };

  return (
    <Wrapper>
      <Header>
        <TouchableOpacity onPress={goBack}>
          <BeforeButton>&lt;</BeforeButton>
        </TouchableOpacity>
        <HeaderText>내 정보</HeaderText>
      </Header>
      <ProfileImgContainer>
        <ProfileImg
          source={require('../images/profileImgs/profileImg_default.png')}
          resizeMode="cover"
        />
        <EditIcon source={require('../images/pencil.png')} />
      </ProfileImgContainer>
      <MiddleTextContainer>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <QuestionMark source={require('../images/questionMark.png')} />
        </TouchableOpacity>
        <TierBadge source={require('../images/tierBadge.png')} />
        <MiddleText>
          <Highlight>나는야초보</Highlight> 님, 오늘도 달려볼까요?
        </MiddleText>
      </MiddleTextContainer>
      <InfoContainer>
        <Row>
          <Category>닉네임</Category>
          <Value>나는야초보</Value>
        </Row>
        <Row>
          <Category>성별</Category>
          <Value>여성</Value>
        </Row>
        <Row>
          <Category>생년월일</Category>
          <Value>1999.01.02</Value>
        </Row>
        <Row>
          <Category>전화번호</Category>
          <Value>010-4303-8511</Value>
        </Row>
        <EditRow>
          <EditButton>
            <EditButtonText>수정</EditButtonText>
          </EditButton>
        </EditRow>
      </InfoContainer>

      <LevelModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </Wrapper>
  );
};

export default MyPageScreen;

const Wrapper = styled.View`
  height: 100%;
  width: 100%;
  background-color: #222831;
  padding: 20px 20px;
  gap: 30px;
`;

const Header = styled.View`
  width: 100%;
  height: 7%;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0 10px;
  gap: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #3d4859;
`;
const BeforeButton = styled.Text`
  font-size: 20px;
  color: #ffffff;
  font-weight: bold;
`;
const HeaderText = styled.Text`
  font-size: 20px;
  color: #ffffff;
  font-weight: bold;
`;

const ProfileImgContainer = styled.View`
  width: 100%;
  height: 16%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const ProfileImg = styled.Image`
  width: 130px;
  height: 130px;
  border-radius: 75px;
  border: 1px solid #ffffff;
`;
const EditIcon = styled.Image`
  width: 20px;
  height: 20px;
  position: absolute;
  right: 145px;
  top: 85px;
`;

const MiddleTextContainer = styled.View`
  width: 100%;
  height: 4%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 2px;
`;
const QuestionMark = styled(Image)`
  width: 12px;
  height: 12px;
`;
const TierBadge = styled(Image)`
  width: 25px;
  height: 25px;
`;
const MiddleText = styled.Text`
  font-size: 16px;
  color: #ffffff;
`;
const Highlight = styled.Text`
  font-weight: bold;
  text-decoration-line: underline;
`;

const InfoContainer = styled.View`
  width: 100%;
  height: 61%;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  padding: 40px;
  border-radius: 18px;
`;
const Row = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const Category = styled.Text`
  color: #000;
  font-weight: bold;
  font-size: 16px;
`;
const Value = styled.Text`
  background-color: #f3f3f3;
  width: 170px;
  padding: 12px 0;
  border-radius: 5px;
  font-size: 14px;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const EditRow = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
const EditButton = styled.TouchableOpacity`
  padding: 13px 33px;
  background-color: #cdd800;
  border-radius: 5px;
  align-self: center;
  justify-self: center;
`;
const EditButtonText = styled.Text`
  color: #ffffff;
  font-size: 12px;
`;
