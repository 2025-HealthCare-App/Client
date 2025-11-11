import React, {useCallback, useState} from 'react';
import {Alert, Image} from 'react-native';
import styled from 'styled-components/native';
import QuestModal from '../common/QuestModal';
import {useNavigation} from '@react-navigation/native';
import {getMyUserInfoAPI} from '../../apis/user/userInfoAPI';
import {useRecoilState, useSetRecoilState} from 'recoil';
import {userInfoAtom} from '../../recoil/atom';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authState} from '../../recoil/authState';

const UserBar = () => {
  const [modalVisible, setModalVisible] = useState(false); // 모달 상태
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom); // Recoil 상태에서 유저 정보 가져오기
  const setAuthState = useSetRecoilState(authState); // 👈 로그인 상태 변경 함수

  const navigation = useNavigation();

  // tier에 따라 뱃지 이미지 경로 선택
  const getTierBadgeSource = (tier: number | undefined) => {
    switch (tier) {
      case 1:
        return require('../../images/tiers/tier_1.png');
      case 2:
        return require('../../images/tiers/tier_2.png');
      case 3:
        return require('../../images/tiers/tier_3.png');
      case 4:
        return require('../../images/tiers/tier_4.png');
      default:
        return require('../../images/tiers/tier_1.png'); // 기본값
    }
  };

  //나의 유저 정보 API 호출 및 세팅
  // useFocusEffect를 사용하여 화면이 포커스될 때마다 유저 정보 갱신

  useFocusEffect(
    useCallback(() => {
      getMyUserInfoAPI()
        .then(response => {
          const data = response.data;
          setUserInfo({
            Uid: data.Uid,
            name: data.name,
            gender: data.gender,
            birth: data.birth,
            profileImage: data.profile_image,
            tier: data.tier,
            points: data.points,
            level: data.level,
            totalDistance: data.total_distance,
          });
        })
        .catch(error => {
          console.error('유저 정보 조회 실패 (토큰 만료로 추정):', error);
          Alert.alert(
            '세션 만료',
            '로그인 정보가 만료되었습니다. 다시 로그인 해주세요.',
          );

          // --- 여기가 핵심 수정 부분입니다 ---
          // 1. 저장된 토큰을 삭제합니다.
          AsyncStorage.removeItem('token');
          // 2. 전역 로그인 상태를 false로 변경합니다.
          setAuthState({isLoggedIn: false});
        });
    }, [setUserInfo, setAuthState]),
  );

  return (
    <Wrapper>
      {/* 모달 */}
      <QuestModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
      <UserInfoContainer onPress={() => navigation.navigate('Mypage')}>
        <ProfileImg
          source={
            userInfo?.profileImage
              ? {uri: userInfo.profileImage}
              : require('../../images/profileImgs/profileImg_default.png')
          }
        />
        <TierBadge source={getTierBadgeSource(userInfo?.tier)} />
        <UserName>{userInfo?.name}</UserName>
      </UserInfoContainer>
      <PointContainer>
        <Image
          source={require('../../images/point.png')}
          style={{width: 30, height: 30, marginRight: -15, zIndex: 999}}
        />
        <PointTextContainer onPress={() => navigation.navigate('RecentPoints')}>
          <PointText>{userInfo?.points.toLocaleString()} P</PointText>
        </PointTextContainer>
      </PointContainer>
      <QuestContainer onPress={() => setModalVisible(true)}>
        <QuestImage source={require('../../images/quest.png')} />
      </QuestContainer>
    </Wrapper>
  );
};

export default UserBar;

const Wrapper = styled.View`
  width: 95%;
  height: 70px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const UserInfoContainer = styled.TouchableOpacity`
  width: 200px;
  height: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  background-color: #fcfcfc;
  border: 3px solid #d0d0d0;
  border-radius: 50px;
  padding: 5px 10px;
`;

const PointContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;
const PointTextContainer = styled.TouchableOpacity`
  width: 100px;
  height: 30px;
  background-color: #fcfcfc;
  border: 3px solid #d0d0d0;
  border-radius: 50px;
  justify-content: center;
  align-items: center;
`;
const PointText = styled.Text`
  font-size: 13px;
  color: #353535;
  font-family: 'Pretendard';
`;

const ProfileImg = styled(Image)`
  width: 50px;
  height: 50px;
  border-radius: 50px;
  margin-right: 10px;
`;
const TierBadge = styled(Image)`
  width: 30px;
  height: 30px;
`;
const UserName = styled.Text`
  font-size: 15px;
  color: #353535;
  font-weight: bold;
  font-family: 'Pretendard';
  /* TODO: 여기서 글자수 제한 !! */
`;

const QuestContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const QuestImage = styled(Image)`
  width: 30px;
  height: 30px;
  z-index: 999;
`;
