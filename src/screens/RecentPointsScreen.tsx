import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import {getRecentPoints} from '../apis/points/pointsAPI';
import {formatDate} from '../utils/util';
import {convertActionCodeToText} from '../utils/actionCodeUtil';
import {useNavigation} from '@react-navigation/native';

type PointHistory = {
  id: number;
  action_code: string;
  description: string;
  points: number;
  created_at: string;
};

const RecentPointsScreen = () => {
  const [pointHistories, setPointHistories] = useState<PointHistory[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    getRecentPoints()
      .then(data => {
        console.log('최근 포인트 내역:', JSON.stringify(data, null, 2));
        setPointHistories(data.history);
      })
      .catch(error => {
        console.error('최근 포인트 내역 가져오기 실패:', error);
      });
  }, []);

  return (
    <Wrapper>
      <Header>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BeforeButton>&lt;</BeforeButton>
        </TouchableOpacity>
        <HeaderText>최근 포인트 내역</HeaderText>
      </Header>

      {/* 헤더 고정 영역 */}
      <PointsHeader>
        <PointsHeaderText>날짜</PointsHeaderText>
        <PointsHeaderText>포인트</PointsHeaderText>
        <PointsHeaderText>설명</PointsHeaderText>
      </PointsHeader>

      {/* 스크롤 영역 */}
      <PointsTable>
        {pointHistories.map((item, index) => (
          <PointsRow key={index}>
            <PointsText>{formatDate(item.created_at)}</PointsText>
            <PointsText>
              {item.points > 0 ? `+${item.points}` : item.points}
            </PointsText>
            <PointsText>{convertActionCodeToText(item.action_code)}</PointsText>
          </PointsRow>
        ))}
      </PointsTable>
    </Wrapper>
  );
};

export default RecentPointsScreen;

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
  font-size: 22px;
  color: #ffffff;
  font-weight: bold;
`;

const PointsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 20px;
  border-bottom-width: 1px;
  border-bottom-color: #3d4859;
`;
const PointsText = styled.Text`
  flex: 1;
  color: #ffffff;
`;

const PointsTable = styled.ScrollView`
  flex: 1; /* 화면에서 남은 공간 다 사용 */
  background-color: #393e46;
  border-radius: 10px;
`;

const PointsHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
  background-color: #393e46; /* 고정 영역 색상 */
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #3d4859;
`;

const PointsHeaderText = styled.Text`
  flex: 1;
  color: #ffffff;
  font-weight: bold;
`;
