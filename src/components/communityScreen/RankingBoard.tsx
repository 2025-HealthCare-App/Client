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
  const [isRanThisWeek, setIsRanThisWeek] = useState<boolean>(false); // 이번주 달린 기록 여부
  const userInfo = useRecoilValue(userInfoAtom); // Recoil 상태에서 유저 정보 가져오기
  const animatedHeight = useRef(new Animated.Value(1)).current; // 1 = 펼쳐진 상태

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
        // console.log('랭킹 조회 성공:', JSON.stringify(data, null, 2));
        // topUsers가 3명이 아니면 빈 배열로 채움
        const sortedUsers = (data.topUsers || [])
          .slice()
          .sort((a: RankingUser, b: RankingUser) => a.rank - b.rank);

        // 3명 미만이면 빈 객체로 채움
        const filledUsers = Array(3)
          .fill(null)
          .map((_, i) => sortedUsers[i] || null);

        setRankUsers(filledUsers);
      })
      .catch(error => {
        console.error('랭킹 조회 실패:', error);
      });
  }, []);
  //나의 상위 퍼센트 조회
  useEffect(() => {
    getMyRankAPI()
      .then(response => {
        //나의 이번주 기록 없으면(status 204)
        if (response.status === 204) {
          console.log('이번주 달린 기록이 없습니다.');
          setIsRanThisWeek(false);
          setPercentile(0);
          return;
        }
        setIsRanThisWeek(true);
        const resPercentile = response.data.data.percentile;
        //resPercentile이 0이면 1로 세팅 (상위 0%는 말이 안되니까)
        setPercentile(resPercentile === 0 ? 1 : resPercentile);
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
            name={rankUsers[1]?.name || ' '}
            total_distance={rankUsers[1]?.total_distance || 0}
            imgSrc={
              rankUsers[1]?.profile_image ||
              require('../../images/profileImgs/profileImg_default.png')
            }
            isSecond={true} // 2등 표시
          />
          <Profile
            name={rankUsers[0]?.name || ' '}
            total_distance={rankUsers[0]?.total_distance || 0}
            imgSrc={
              rankUsers[0]?.profile_image ||
              require('../../images/profileImgs/profileImg_default.png')
            }
            isFirst={true} // 1등 표시
          />
          <Profile
            name={rankUsers[2]?.name || ' '}
            total_distance={rankUsers[2]?.total_distance || 0}
            imgSrc={
              rankUsers[2]?.profile_image ||
              require('../../images/profileImgs/profileImg_default.png')
            }
            isThird={true} // 3등 표시
          />
        </ProfilesContainer>

        <PercentText>
          {isRanThisWeek ? (
            <>
              <UserName>{userInfo.name}</UserName>
              <Text> 님은 현재 </Text>
              <Percent>상위 {percentile}%</Percent>
              <Text>에 있어요!</Text>
            </>
          ) : (
            <>
              <UserName>{userInfo.name}</UserName>
              <Text> 님은 이번주 달린 기록이 없어요! </Text>
            </>
          )}
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
