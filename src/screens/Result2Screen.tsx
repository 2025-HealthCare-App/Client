import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {addComma, formatElapsedTime} from '../utils/util';
import {ExerciseParamList, ExerciseType} from '../types/exerciseType';
import {Alert, TouchableOpacity} from 'react-native';
import {patchMyExerciseTitleAPI} from '../apis/exercise/exerciseAPI';

type ResultScreenRouteProp = RouteProp<ExerciseParamList, 'Result'>;

const Result2Screen = () => {
  const route = useRoute<ResultScreenRouteProp>();
  const exercise: ExerciseType = route.params;

  const {
    distance,
    steps,
    elapsedSec,
    Kcal,
    startTime,
    staticMapUrl,
    exTitle,
    date,
    points,
  } = exercise;
  // 수정 모드 상태 및 타이틀 입력 상태 추가
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(exTitle || '');

  const navigation = useNavigation();

  // (수정) 완료 버튼 클릭 시
  const handleEditComplete = () => {
    if (!editTitle.trim()) {
      Alert.alert('운동 제목을 입력해주세요.');
      return;
    }
    if (editTitle.length > 20) {
      Alert.alert('운동 제목은 20자 이내로 입력해주세요.');
      return;
    }

    //인자 확인
    console.log(exercise.exerciseId, editTitle);
    patchMyExerciseTitleAPI(exercise.exerciseId, editTitle)
      .then(() => {
        setIsEditMode(false);
        Alert.alert('운동 제목이 수정되었습니다.', editTitle);
      })
      .catch(error => {
        console.error('운동 제목 수정 실패:', error);
        Alert.alert('운동 제목 수정에 실패했습니다. 다시 시도해주세요.');
      });
  };

  useEffect(() => {
    console.log('여기서는 post 안하고 only 운동 기록 조회용!!');
    // console.log('운동 기록:', JSON.stringify(exercise, null, 2));
  }, [exercise, startTime, elapsedSec]);

  return (
    <Wrapper>
      <Header>
        <BeforeButton onPress={() => navigation.goBack()}>
          <BeforeText>&lt;</BeforeText>
        </BeforeButton>
      </Header>
      <Main>
        <ResultTitleContainer>
          <DateandTime>
            {date} {startTime}
          </DateandTime>
          <Titlecontainer>
            {isEditMode ? (
              <>
                <TitleInput
                  value={editTitle}
                  onChangeText={setEditTitle}
                  placeholder="운동 제목을 입력하세요"
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleEditComplete}
                />
                <TouchableOpacity onPress={handleEditComplete}>
                  <EditTitleBtn>완료</EditTitleBtn>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <ResultTitle>{editTitle || `${startTime} 의 운동`}</ResultTitle>
                <TouchableOpacity onPress={() => setIsEditMode(true)}>
                  <EditTitleBtn>수정</EditTitleBtn>
                </TouchableOpacity>
              </>
            )}
          </Titlecontainer>
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
              <TotalPointText>{points} P를 획득했어요!</TotalPointText>
            </TotalPointRow>
          </PointsContainer>
          <ResultMap
            source={{
              uri: staticMapUrl,
            }}
            resizeMode="cover"
            onError={e => console.warn('Image load error', e.nativeEvent)}
          />
        </ContentsContainer>
      </Main>
    </Wrapper>
  );
};

export default Result2Screen;

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
const Titlecontainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
`;
const EditTitleBtn = styled.Text`
  font-size: 11px;
  color: #02adb5;
  text-align: center;
  font-weight: bold;
  padding: 5px 7px;
  border-radius: 5px;
  background-color: #f0f0f0;
  transition: background-color 0.3s ease;
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

const TitleInput = styled.TextInput`
  flex: 1;
  font-size: 18px;
  color: #222831;
  font-weight: bold;
  text-align: left;
  background-color: #f5f5f5;
  border-radius: 5px;
  padding: 5px 10px;
  margin-right: 10px;
`;
