import React, {useEffect, useState} from 'react';
import {Image} from 'react-native';
import styled from 'styled-components/native';
import QuestModal from '../common/QuestModal';
import {useNavigation} from '@react-navigation/native';
import {getMyUserInfoAPI} from '../../apis/user/userInfoAPI';
import {useRecoilState} from 'recoil';
import {userInfoAtom} from '../../recoil/atom';

const UserBar = () => {
  const [modalVisible, setModalVisible] = useState(false); // 모달 상태
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom); // Recoil 상태에서 유저 정보 가져오기

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
  useEffect(() => {
    getMyUserInfoAPI()
      .then(response => {
        // console.log('나의 유저 정보:', response.data);
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
        console.error('유저 정보 조회 실패:', error);
      });
  }, [setUserInfo]);

  return (
    <Wrapper>
      {/* 모달 */}
      <QuestModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
      <UserInfoContainer onPress={() => navigation.navigate('Mypage')}>
        <ProfileImg
          source={require('../../images/profileImgs/profileImg1.jpg')}
        />
        <TierBadge source={getTierBadgeSource(userInfo?.tier)} />
        <UserName>{userInfo?.name}</UserName>
      </UserInfoContainer>
      <PointContainer>
        <Image
          source={require('../../images/point.png')}
          style={{width: 30, height: 30, marginRight: -15, zIndex: 999}}
        />
        <PointTextContainer>
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
  background-color: #00494d;
  border: 3px solid #02adb5;
  border-radius: 50px;
  padding: 5px 10px;
`;

const PointContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;
const PointTextContainer = styled.View`
  width: 100px;
  height: 30px;
  background-color: #00494d;
  border: 3px solid #02adb5;
  border-radius: 50px;
  justify-content: center;
  align-items: center;
`;
const PointText = styled.Text`
  font-size: 13px;
  /* font-weight: bold; */
  color: white;
  font-family: 'Pretendard';
`;

const ProfileImg = styled(Image)`
  width: 50px;
  height: 50px;
  border-radius: 50px;
`;
const TierBadge = styled(Image)`
  width: 30px;
  height: 30px;
`;
const UserName = styled.Text`
  font-size: 15px;
  color: #ffffff;
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
