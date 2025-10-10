import {
  RouteProp,
  StackActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, {useEffect} from 'react';
import styled from 'styled-components/native';
import {addComma, formatElapsedTime} from '../utils/util';
import {ExerciseParamList} from '../types/exerciseType';
import {convertActionCodeToText} from '../utils/actionCodeUtil';
import {deleteMyExerciseAPI} from '../apis/exercise/exerciseAPI';
import {Alert} from 'react-native';

type ResultScreenRouteProp = RouteProp<ExerciseParamList, 'Result'>;

const ResultScreen = () => {
  const route = useRoute<ResultScreenRouteProp>();
  const navigation = useNavigation();
  const {
    distance,
    steps,
    elapsedSec,
    Kcal,
    startTime,
    staticMapUrl,
    date,
    rewards,
    exerciseId,
  } = route.params;

  // ✅ 포인트 합산 (문자열 방지 + null/undefined 안전 처리)
  const totalPoints =
    rewards?.reduce((acc, reward) => acc + Number(reward.points || 0), 0) ?? 0;

  // 확인용
  useEffect(() => {
    console.log('exerciseId:', exerciseId);
  }, [exerciseId]);

  const handleDelete = () => {
    Alert.alert('운동 기록 삭제', '정말로 이 운동 기록을 삭제하시겠습니까?', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => {
          deleteMyExerciseAPI(exerciseId)
            .then(() => {
              Alert.alert('운동 기록이 삭제되었습니다.');
              navigation.goBack();
            })
            .catch(error => {
              console.error('운동 기록 삭제 실패:', error);
              Alert.alert('운동 기록 삭제에 실패했습니다. 다시 시도해주세요.');
            });
        },
      },
    ]);
  };

  return (
    <Wrapper>
      <Header />

      <Main>
        <ResultTitleContainer>
          <DateandTime>
            {date} {startTime}
          </DateandTime>
          <ResultTitle>{`${startTime} 의 운동`}</ResultTitle>
        </ResultTitleContainer>

        <ContentsContainer>
          {/* 거리 */}
          <KMContainer>
            <KM>{(distance / 1000).toFixed(2)}</KM>
            <CategoryText>Km</CategoryText>
          </KMContainer>

          {/* 기타 정보 */}
          <OthersContainer>
            <Category>
              <Value>{formatElapsedTime(elapsedSec)}</Value>
              <CategoryText>Time</CategoryText>
            </Category>
            <Category>
              <Value>{addComma(steps)}</Value>
              <CategoryText>Step</CategoryText>
            </Category>
            <Category>
              <Value>{Kcal}</Value>
              <CategoryText>Kcal</CategoryText>
            </Category>
          </OthersContainer>

          {/* 포인트 내역 */}
          <PointsContainer>
            {rewards?.map((reward, index) => (
              <PointRow key={index}>
                <CheckBox />
                <PointText>
                  {convertActionCodeToText(reward.action_code)}
                </PointText>
                <PointValue>+ {reward.points} P</PointValue>
              </PointRow>
            ))}
            {totalPoints > 0 ? (
              <TotalPointRow>
                <TotalPointText>{totalPoints} P를 획득했어요!</TotalPointText>
              </TotalPointRow>
            ) : (
              <TotalPointRow>
                <TotalPointText
                  style={{
                    color: '#919191',
                    fontWeight: 'normal',
                    fontSize: 14,
                  }}>
                  획득한 포인트가 없어요
                </TotalPointText>
              </TotalPointRow>
            )}
          </PointsContainer>

          {/* 지도 */}
          <ResultMap
            source={{uri: staticMapUrl}}
            resizeMode="cover"
            onError={e => console.warn('Image load error', e.nativeEvent)}
          />

          <BtnsContainer>
            {/* 완료, 삭제 버튼 */}
            <DeleteBtn
              // 👇 navigation.navigate 대신 popToTop()을 사용
              onPress={() => navigation.dispatch(StackActions.popToTop())}>
              <DeleteText>완료</DeleteText>
            </DeleteBtn>
            <DeleteBtn
              onPress={handleDelete}
              style={{backgroundColor: '#e3e3e3'}}>
              <DeleteText>삭제</DeleteText>
            </DeleteBtn>
          </BtnsContainer>
        </ContentsContainer>
      </Main>
    </Wrapper>
  );
};

export default ResultScreen;

const ResultMap = styled.Image`
  width: 90%;
  height: 230px;
  object-fit: cover;
  object-position: center;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const PointsContainer = styled.View`
  width: 90%;
  justify-content: center;
  align-items: flex-start;
  margin-top: 10px;
  background: #f5f5f5;
  border-radius: 10px;
  padding: 10px 20px;
  margin-bottom: 20px;
  margin-top: 20px;
`;
const PointRow = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 0;
  gap: 10px;
`;
const CheckBox = styled.View`
  width: 5px;
  height: 5px;
  border-radius: 50px;
  background-color: #1a1a1a;
  border: 1px solid #1a1a1a;
  justify-content: center;
`;
const PointText = styled.Text`
  font-size: 12px;
  color: #393939;
  text-align: center;
`;
const PointValue = styled.Text`
  font-size: 12px;
  color: #b5b5b5;
  margin-left: auto;
`;
const TotalPointRow = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  border-top-width: 1px;
  border-top-color: #dfdfdf;
`;
const TotalPointText = styled.Text`
  font-size: 16px;
  color: #393939;
  text-align: center;
  font-weight: bold;
`;

const Wrapper = styled.ScrollView`
  height: 100%;
  width: 100%;
  background-color: #ffffff;
  padding: 10px 20px;
`;

const Header = styled.View`
  width: 100%;
  height: 4%;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0 10px;
  gap: 10px;
  /* background-color: #ffdfdf; */
`;

const Main = styled.ScrollView`
  width: 100%;
  margin-top: 15px;
`;

const ResultTitleContainer = styled.View`
  width: 90%;
  justify-content: center;
  align-items: flex-start;
  border-bottom-width: 1px;
  border-bottom-color: #dfdfdf;
  padding-bottom: 15px;
  align-self: center;
`;
const DateandTime = styled.Text`
  font-size: 16px;
  color: #7b7b7b;
  text-align: center;
`;
const ResultTitle = styled.Text`
  font-size: 19px;
  color: #1a1a1a;
  font-weight: bold;
  text-align: center;
`;

const ContentsContainer = styled.View`
  width: 100%;
  margin-top: 20px;
  display: flex;
  padding-bottom: 50px;
  align-items: center;
`;
const KMContainer = styled.View`
  width: 90%;
  justify-content: center;
  align-items: flex-start;
`;
const KM = styled.Text`
  font-size: 75px;
  font-style: italic;
  font-weight: bold;
  text-align: center;
  color: #1a1a1a;
`;

const OthersContainer = styled.View`
  width: 90%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const Category = styled.View`
  width: 33%;
  justify-content: center;
  align-items: flex-start;
`;
const Value = styled.Text`
  font-size: 27px;
  color: #1a1a1a;
  font-weight: bold;
  text-align: center;
`;
const CategoryText = styled.Text`
  font-size: 13px;
  color: #7b7b7b;
  text-align: center;
  margin-bottom: 10px;
`;

const BtnsContainer = styled.View`
  width: 90%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const DeleteBtn = styled.TouchableOpacity`
  background-color: #17db86;
  padding: 10px 20px;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
`;

const DeleteText = styled.Text`
  font-size: 14px;
  color: #ffffff;
  font-weight: bold;
`;
