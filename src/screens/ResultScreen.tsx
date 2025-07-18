import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect} from 'react';
import styled from 'styled-components/native';
import {addComma, formatElapsedTime} from '../utils/util';
import {postMyExercisesAPI} from '../apis/exercise/exerciseAPI';

type RootStackParamList = {
  Result: {
    distance: number;
    steps: number;
    elapsedSec: number;
    Kcal: number;
    startTime: string;
    staticMapUrl?: string;
    activityTitle?: string; // Optional, if you want to display a title
    points?: number; // Optional, if you want to display points
  };
};
type ResultScreenRouteProp = RouteProp<RootStackParamList, 'Result'>;

const ResultScreen = () => {
  const route = useRoute<ResultScreenRouteProp>();
  const {distance, steps, elapsedSec, Kcal, startTime, staticMapUrl} =
    route.params;

  console.log('[ResultScreen] Static Map URL:', staticMapUrl);

  const navigation = useNavigation();

  //임시 데이터 //TODO: 실제 운동한 데이터로 변경
  const newExercise = {
    ex_title: '런닝머신 30분',
    ex_distance: 3000,
    ex_kcal: 250,
    ex_steps: 4000,
    ex_start_time: '14:30:00',
    ex_end_time: '15:00:00',
    ex_route_image:
      'https://maps.googleapis.com/maps/api/staticmap?size=600x400&path=color:0xff0000ff|weight:5|37.4219983,-122.084|37.4219983,-122.084&key=AIzaSyBEyEYuNOq8OreVSXUgbPSJDurTYlM6vTg', // 경로 이미지
  };
  useEffect(() => {
    postMyExercisesAPI(newExercise)
      .then(response => {
        console.log('운동 기록 저장 성공:', response.data);
      })
      .catch(error => {
        console.error('운동 기록 저장 실패:', error);
      });
  }, []);

  return (
    <Wrapper>
      <Header>
        <BeforeButton onPress={() => navigation.navigate('Main')}>
          <BeforeText>&lt;</BeforeText>
        </BeforeButton>
      </Header>
      <Main>
        <ResultTitleContainer>
          <DateandTime>{startTime}</DateandTime>
          <ResultTitle>
            {route.params.activityTitle || `${startTime} 의 운동`}
          </ResultTitle>
        </ResultTitleContainer>
        <ContentsContainer>
          <KMContainer>
            <KM>{(distance / 1000).toFixed(2)}</KM>
            <CategoryText>Km</CategoryText>
          </KMContainer>
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
          <PointsContainer>
            <PointRow>
              <CheckBox />
              <PointText>포인트 적립</PointText>
              <PointValue>+ 100</PointValue>
            </PointRow>
            <PointRow>
              <CheckBox />
              <PointText>포인트 적립</PointText>
              <PointValue>+ 100</PointValue>
            </PointRow>
            <TotalPointRow>
              <TotalPointText>339 P를 획득했어요!</TotalPointText>
            </TotalPointRow>
          </PointsContainer>
          <ResultMap
            source={{
              uri:
                staticMapUrl ||
                'https://maps.googleapis.com/maps/api/staticmap?size=600x400&path=color:0xff0000ff|weight:5|37.5031393,126.9571197&key=AIzaSyBEyEYuNOq8OreVSXUgbPSJDurTYlM6vTg',
            }}
            resizeMode="cover"
            onError={e => console.warn('Image load error', e.nativeEvent)}
          />
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
  background-color: #222831;
  border: 1px solid #222831;
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
  padding: 10px 0;
`;
const TotalPointText = styled.Text`
  font-size: 16px;
  color: #393939;
  text-align: center;
  font-weight: bold;
`;

const Wrapper = styled.View`
  height: 100%;
  width: 100%;
  background-color: #ffffff;
  padding: 15px 20px;
`;

const Header = styled.View`
  width: 100%;
  height: 7%;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0 10px;
  gap: 10px;
  /* background-color: #ffdfdf; */
`;
const BeforeButton = styled.TouchableOpacity`
  height: 100%;
  justify-content: center;
`;
const BeforeText = styled.Text`
  font-size: 20px;
  color: #222831;
  font-weight: bold;
`;

const Main = styled.View`
  width: 100%;
  height: 100%;
  align-items: center;
  /* border: 1px solid #3d4859; */
`;

const ResultTitleContainer = styled.View`
  width: 90%;
  justify-content: center;
  align-items: flex-start;
  border-bottom-width: 1px;
  border-bottom-color: #dfdfdf;
  padding-bottom: 15px;
`;
const DateandTime = styled.Text`
  font-size: 16px;
  color: #7b7b7b;
  text-align: center;
`;
const ResultTitle = styled.Text`
  font-size: 19px;
  color: #222831;
  font-weight: bold;
  text-align: center;
`;

const ContentsContainer = styled.View`
  width: 100%;
  margin-top: 20px;
  display: flex;

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
  color: #222831;
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
  color: #222831;
  font-weight: bold;
  text-align: center;
`;
const CategoryText = styled.Text`
  font-size: 13px;
  color: #7b7b7b;
  text-align: center;
  margin-bottom: 10px;
`;
