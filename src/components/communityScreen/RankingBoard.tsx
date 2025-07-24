import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components/native';
import Profile from './Profile';
import {Text, Animated, TouchableOpacity} from 'react-native';
import {getMyRankAPI, getRankingsAPI} from '../../apis/community/rankAPI';
import {useRecoilValue} from 'recoil';
import {userInfoAtom} from '../../recoil/atom';

type RankingUser = {
  name: string;
  total_distance: number;
  profile_image: string;
  tier: number;
  Uid: number;
  rank: number;
};

const RankingBoard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [rankUsers, setRankUsers] = useState<RankingUser[]>([]); // 랭킹 사용자 목록
  const [percentile, setPercentile] = useState<number>(0); // 나의 상위 퍼센트
  const userInfo = useRecoilValue(userInfoAtom); // Recoil 상태에서 유저 정보 가져오기
  const animatedHeight = useRef(new Animated.Value(1)).current; // 1 = 펼쳐진 상태

  const profileImages = {
    // 이미지 경로를 객체로 관리 TODO: 임시
    profileImg1: require('../../images/profileImgs/profileImg1.jpg'),
    profileImg2: require('../../images/profileImgs/profileImg2.png'),
    profileImg3: require('../../images/profileImgs/profileImg3.png'),
  };

  const toggleRankingBoard = () => {
    const toValue = isCollapsed ? 1 : 0; // 0 = 접힌 상태

    Animated.timing(animatedHeight, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setIsCollapsed(!isCollapsed);
  };

  //랭킹 조회 API 호출
  useEffect(() => {
    getRankingsAPI()
      .then(data => {
        console.log('랭킹 조회 성공:', JSON.stringify(data, null, 2));
        // rank 기준으로 정렬 (1,2,3위 순서)
        const sortedUsers = (data.topUsers || [])
          .slice()
          .sort((a: RankingUser, b: RankingUser) => a.rank - b.rank);
        setRankUsers(sortedUsers);
      })
      .catch(error => {
        console.error('랭킹 조회 실패:', error);
      });
  }, []);
  //나의 상위 퍼센트 조회
  useEffect(() => {
    getMyRankAPI()
      .then(response => {
        setPercentile(response.data.percentile);
      })
      .catch(error => {
        console.error('나의 상위 퍼센트 조회 실패:', error);
      });
  }, []);

  return (
    <Animated.View
      style={{
        width: '100%',
        height: animatedHeight.interpolate({
          inputRange: [0, 1],
          outputRange: [80, 320], // 접힌 높이 80px, 펼친 높이 320px
        }),
        overflow: 'hidden',
      }}>
      <Wrapper>
        <TitleContainer>
          <Title>이번주 실시간 랭킹</Title>
          <ToggleButton onPress={toggleRankingBoard}>
            <ToggleText>{isCollapsed ? '▼' : '▲'}</ToggleText>
          </ToggleButton>
        </TitleContainer>

        <ProfilesContainer>
          <Profile
            name={rankUsers[1]?.name || '익명'}
            total_distance={rankUsers[1]?.total_distance || 0}
            imgSrc={rankUsers[1]?.profile_image || profileImages.profileImg2}
            isSecond={true} // 2등 표시
          />
          <Profile
            name={rankUsers[0]?.name || '익명'}
            total_distance={rankUsers[0]?.total_distance || 0}
            imgSrc={rankUsers[0]?.profile_image || profileImages.profileImg1}
            isFirst={true} // 1등 표시
          />
          <Profile
            name={rankUsers[2]?.name || '익명'}
            total_distance={rankUsers[2]?.total_distance || 0}
            imgSrc={rankUsers[2]?.profile_image || profileImages.profileImg3}
            isThird={true} // 3등 표시
          />
        </ProfilesContainer>

        <PercentText>
          <UserName>{userInfo.name}</UserName>
          <Text> 님은 현재 </Text>
          <Percent>상위 {percentile}%</Percent>
          <Text>에 있어요!</Text>
        </PercentText>
      </Wrapper>
    </Animated.View>
  );
};

export default RankingBoard;

const Wrapper = styled.View`
  width: 100%;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  justify-content: flex-start;
  align-items: center;
  background-color: #393e46;
  padding: 30px 20px;
  gap: 15px;
`;

const TitleContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #ffffff;
  text-align: left;
`;

const ToggleButton = styled(TouchableOpacity)`
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 15px;
  padding: 6px 10px;
`;

const ToggleText = styled.Text`
  color: #ffffff;
  font-size: 14px;
  font-weight: bold;
`;

const ProfilesContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 30px;
`;

const PercentText = styled.Text`
  font-size: 15px;
  color: #ffffff;
  margin-top: 10px;
  text-align: center;
  width: 100%;
`;

const UserName = styled.Text`
  font-weight: bold;
  color: #00adb5;
  font-size: 19px;
  font-weight: bold;
  text-decoration-line: underline;
`;

const Percent = styled.Text`
  font-weight: bold;
  font-size: 17px;
  font-weight: bold;
  text-decoration-line: underline;
`;
