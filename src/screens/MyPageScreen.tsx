import React, {useEffect, useState, useCallback} from 'react';
import {Alert, Image, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import LevelModal from '../components/mypageScreen/LevelModal';
import {useNavigation} from '@react-navigation/native';
import {changeProfileImageAPI} from '../apis/user/profileAPI';
import {
  launchImageLibrary,
  ImagePickerResponse,
} from 'react-native-image-picker';
import {useRecoilState} from 'recoil';
import {userInfoAtom} from '../recoil/atom';
import {formatGender} from '../utils/util';

const MyPageScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [originImage, setOriginImage] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);

  const navigation = useNavigation();

  // 뒤로가기
  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // 프로필 이미지 업로드
  const handleImageUpload = useCallback(() => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1,
      },
      async (response: ImagePickerResponse) => {
        if (response.didCancel) {
          console.log('사용자가 취소함');
        } else if (response.errorCode) {
          console.error('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          setPreviewImage(asset.uri || null);

          Alert.alert('프로필 사진 변경', '이 사진으로 변경할까요?', [
            {
              text: '취소',
              style: 'cancel',
              onPress: () => setPreviewImage(originImage),
            },
            {
              text: '확인',
              onPress: async () => {
                try {
                  await changeProfileImageAPI({
                    uri: asset.uri,
                    type: asset.type || 'image/jpeg',
                    fileName: asset.fileName || 'profile.jpg',
                  });
                  Alert.alert('성공', '프로필 사진이 변경되었습니다.');
                  setOriginImage(asset.uri ?? null);
                  setUserInfo(prev => ({
                    ...prev,
                    profileImage: asset.uri ?? prev.profileImage,
                  }));
                } catch (err) {
                  console.error('업로드 실패', err);
                }
              },
            },
          ]);
        }
      },
    );
  }, [originImage, setUserInfo]);

  // tier에 따라 뱃지 이미지 경로 선택
  const getTierBadgeSource = (tier: number | undefined) => {
    switch (tier) {
      case 1:
        return require('../images/tiers/tier_1.png');
      case 2:
        return require('../images/tiers/tier_2.png');
      case 3:
        return require('../images/tiers/tier_3.png');
      case 4:
        return require('../images/tiers/tier_4.png');
      default:
        return require('../images/tiers/tier_1.png'); // 기본값
    }
  };

  // 최초 렌더링 및 userInfo.profileImage 변경 시 원본/미리보기 이미지 동기화
  useEffect(() => {
    if (userInfo.profileImage) {
      setOriginImage(userInfo.profileImage);
      setPreviewImage(userInfo.profileImage);
    }
  }, [userInfo.profileImage]);

  return (
    <Wrapper>
      <Header>
        <TouchableOpacity onPress={goBack}>
          <BeforeButton>&lt;</BeforeButton>
        </TouchableOpacity>
        <HeaderText>내 정보</HeaderText>
      </Header>
      <ProfileImgContainer onPress={handleImageUpload}>
        <ProfileImg
          source={
            previewImage
              ? {uri: String(previewImage)}
              : originImage
              ? {uri: String(originImage)}
              : require('../images/profileImgs/profileImg_default.png')
          }
          resizeMode="cover"
        />
        <EditIcon source={require('../images/pencil.png')} />
      </ProfileImgContainer>
      <MiddleTextContainer>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <QuestionMark source={require('../images/questionMark.png')} />
        </TouchableOpacity>
        <TierBadge source={getTierBadgeSource(userInfo?.tier)} />
        <MiddleText>
          <Highlight>{userInfo.name}</Highlight> 님, 오늘도 달려볼까요?
        </MiddleText>
      </MiddleTextContainer>
      <InfoContainer>
        <Row>
          <Category>닉네임</Category>
          <Value>{userInfo.name}</Value>
        </Row>
        <Row>
          <Category>성별</Category>
          <Value>{formatGender(userInfo.gender)}</Value>
        </Row>
        <Row>
          <Category>생년월일</Category>
          <Value>{userInfo.birth}</Value>
        </Row>
        <Row>
          <Category>누적 달린 거리</Category>
          <Value>{(userInfo.totalDistance / 1000).toLocaleString()} km</Value>
        </Row>
      </InfoContainer>
      <LevelModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </Wrapper>
  );
};

export default MyPageScreen;

// 스타일 컴포넌트 (불필요한 중복/순서 정리)
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

const ProfileImgContainer = styled.TouchableOpacity`
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
