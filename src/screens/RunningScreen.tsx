import styled from 'styled-components/native';
import RunningButton from '../components/runningScreen/RunningButton';
import React, {useEffect, useRef, useState} from 'react';
import {Alert, AppState, PermissionsAndroid, Platform} from 'react-native';
import {
  SensorTypes,
  setUpdateIntervalForType,
  accelerometer,
} from 'react-native-sensors';
import Geolocation from 'react-native-geolocation-service';
import MapView, {
  // Polyline,
  // Marker,
  Region,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import {map, filter, throttleTime} from 'rxjs/operators';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {
  addComma,
  createStaticMapUrl,
  formatStartTime,
  formatTime,
  getDistance,
} from '../utils/util';
import Config from 'react-native-config';
import {postMyExercisesAPI} from '../apis/exercise/exerciseAPI';
import {Reward} from '../types/rewardType';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getMyUserInfoAPI} from '../apis/user/userInfoAPI';
type RootStackParamList = {
  Running: undefined;
  Result: {
    distance: number;
    steps: number;
    elapsedSec: number;
    Kcal: number;
    startTime: string;
    staticMapUrl: string;
    rewards?: Reward[];
    exerciseId: number;
  };
};

const RunningScreen = () => {
  const [isRunning, setIsRunning] = useState(true);
  ///타이머
  const [elapsedSec, setElapsedSec] = useState(0); // 총 초
  const intervalRef = useRef<NodeJS.Timer | null>(null);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  //시작 시각을 저장
  const startTime = useRef(new Date().getTime());
  const formattedStartTime = formatStartTime(startTime.current);
  const appState = useRef(AppState.currentState);
  // 운동이 일시정지된 시간 누적 (초)
  const pausedTimeAccum = useRef(0);
  // 마지막으로 일시정지 시작된 시각
  const pauseStartTime = useRef<number | null>(null);
  //  타이머 함수
  const startTimer = () => {
    if (intervalRef.current) {
      return;
    } // 이미 돌고 있으면 무시
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setElapsedSec(prev => prev + 1);
      }, 1000);
    }
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // AppState 감지 (수정)
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async nextState => {
        if (
          appState.current.match(/inactive|background/) &&
          nextState === 'active'
        ) {
          // --- 👇 토큰 유효성 검사 로직 추가 ---
          try {
            // 토큰이 유효한지 테스트하기 위해 API 호출
            await getMyUserInfoAPI();
            console.log('토큰 유효, 달리기 재개');
          } catch (error) {
            // API 호출 실패 (토큰 만료로 간주)
            console.error('백그라운드 복귀 중 토큰 만료 감지:', error);
            // Axios 인터셉터가 자동으로 로그아웃 처리할 것입니다.
            // 여기서는 달리기를 안전하게 중지시킵니다.
            stopTimer();
            setIsRunning(false);
            Alert.alert(
              '세션 만료',
              '로그인 정보가 만료되어 달리기가 중지되었습니다.',
            );
            navigation.goBack(); // 또는 navigation.popToTop();
            return; // 타이머 재시작 로직을 실행하지 않고 종료
          }
          // --- 🔼 검사 로직 끝 ---

          const savedStart = await AsyncStorage.getItem('running_start_time');
          const savedPaused = parseInt(
            (await AsyncStorage.getItem('running_paused_time')) || '0',
            10,
          );
          const savedPauseStart = parseInt(
            (await AsyncStorage.getItem('running_pause_start')) || '0',
            10,
          );

          if (savedStart) {
            let totalPaused = savedPaused;

            // ⬅️ running 상태일 때는 절대 pause 시간 합산 X
            if (!isRunning && savedPauseStart) {
              totalPaused += Math.floor((Date.now() - savedPauseStart) / 1000);
            }

            const diff = Math.floor(
              (Date.now() - parseInt(savedStart, 10)) / 1000,
            );

            setElapsedSec(diff - totalPaused);
          }

          if (isRunning) {
            startTimer();
          }
        } else if (nextState.match(/inactive|background/)) {
          await AsyncStorage.setItem(
            'running_start_time',
            String(startTime.current),
          );
          await AsyncStorage.setItem(
            'running_paused_time',
            String(pausedTimeAccum.current),
          );
          if (pauseStartTime.current) {
            await AsyncStorage.setItem(
              'running_pause_start',
              String(pauseStartTime.current),
            );
          }
          stopTimer();
        }

        appState.current = nextState;
      },
    );

    return () => subscription.remove();
  }, [isRunning, navigation]);

  // 🚀 최초 실행 시 타이머 시작
  useEffect(() => {
    if (isRunning) {
      startTimer();
    } else {
      stopTimer();
    }

    return () => stopTimer();
  }, [isRunning]);

  ////지도 부분///////
  const [steps, setSteps] = useState(0);
  const [kcal, setKcal] = useState(0); // kcal
  const [distance, setDistance] = useState(0); // meters
  const prevLocation = useRef<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [route, setRoute] = useState<
    Array<{latitude: number; longitude: number}>
  >([]);
  const watchId = useRef<number | null>(null);
  const mapRef = useRef<MapView | null>(null);

  const [initialRegion, setInitialRegion] = useState<Region | undefined>(
    undefined,
  );
  // 1. 이동 관련 useEffect
  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        const activityPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
        );
        const locationPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (
          activityPermission !== PermissionsAndroid.RESULTS.GRANTED ||
          locationPermission !== PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.warn('Permission denied');
          return;
        }

        // 걸음 센서
        // 1. 업데이트 간격을 400ms -> 100ms로 줄여 반응 속도를 높임
        setUpdateIntervalForType(SensorTypes.accelerometer, 100);
        const sensorSub = accelerometer
          .pipe(
            map(({x, y, z}) => Math.sqrt(x * x + y * y + z * z)),
            // 2. 민감도를 12 -> 11.5로 낮춰 더 작은 충격도 감지
            filter(mag => mag > 11.5),
            // 3. 350ms(0.35초) 이내의 중복 클릭(신호)은 무시하여 이중 카운트 방지
            throttleTime(350),
          )
          .subscribe(() => {
            setSteps(prev => prev + 1);
          });

        // ✅ 위치 추적 & 초기 위치 설정
        let firstLocationSet = false;
        watchId.current = Geolocation.watchPosition(
          position => {
            const {latitude, longitude, accuracy} = position.coords;

            if (!firstLocationSet) {
              firstLocationSet = true;
              setInitialRegion({
                latitude,
                longitude,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001,
              });
              prevLocation.current = {latitude, longitude}; // 👈 setPrevLocation 대신 .current 사용
              setRoute([{latitude, longitude}]);

              // 📍 첫 위치에서 지도 카메라 이동
              mapRef.current?.animateToRegion(
                {
                  latitude,
                  longitude,
                  latitudeDelta: 0.001,
                  longitudeDelta: 0.001,
                },
                500,
              );
            }

            if (accuracy > 10) {
              return;
            } // 오차 10m 이상 무시

            // 👇 prevLocation.current를 읽도록 수정
            if (prevLocation.current) {
              const d = getDistance(
                prevLocation.current.latitude, // 👈 .current 추가
                prevLocation.current.longitude, // 👈 .current 추가
                latitude,
                longitude,
              );
              setDistance(prev => prev + d);
            }

            prevLocation.current = {latitude, longitude}; // 👈 setPrevLocation 대신 .current 사용
            setRoute(prev => [...prev, {latitude, longitude}]);

            // 📍 실시간 지도 이동
            mapRef.current?.animateToRegion(
              {
                latitude,
                longitude,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001,
              },
              500,
            );
          },
          error => {
            console.warn('Location error:', error);
          },
          {
            enableHighAccuracy: true,
            distanceFilter: 1,
            interval: 3000,
            fastestInterval: 2000,
            showsBackgroundLocationIndicator: true,
          },
        );

        return () => {
          sensorSub.unsubscribe();
          if (watchId.current) {
            Geolocation.clearWatch(watchId.current);
          }
        };
      }
    };

    requestPermissions();
  }, []); // ✅ prevLocation 의존성 제거

  // pause 상태 시작 시
  const handleRunningButtonPress = async () => {
    if (isRunning) {
      // 운동 → 일시정지
      pauseStartTime.current = Date.now();
      await AsyncStorage.setItem(
        'running_pause_start',
        String(pauseStartTime.current),
      );
      stopTimer();
    } else {
      // 일시정지 → 운동 재개
      const pauseStart =
        pauseStartTime.current ??
        parseInt(
          (await AsyncStorage.getItem('running_pause_start')) || '0',
          10,
        );
      // 일시정지 해제 시
      if (pauseStart) {
        pausedTimeAccum.current += Math.floor((Date.now() - pauseStart) / 1000);
      }
      startTimer();
    }
    setIsRunning(prev => !prev);
  };

  //!!운동 종료 처리하는 함수!!
  const apiKey = Config.MAPS_API_KEY;
  const handleStopButtonPress = () => {
    // --- 구글 API의 URL 길이 제한(8,192자)---
    const MAX_POINTS = 300; // URL 길이를 고려한 최대 좌표 수 (조절 가능)
    let simplifiedRoute = route;

    if (route.length > MAX_POINTS) {
      simplifiedRoute = [];
      const step = Math.ceil(route.length / MAX_POINTS);
      for (let i = 0; i < route.length; i += step) {
        simplifiedRoute.push(route[i]);
      }
    }

    const staticMapUrl = createStaticMapUrl(route, String(apiKey));
    const startDate = new Date(startTime.current);

    const newExercise = {
      ex_title: `${startDate.getFullYear()}-${String(
        startDate.getMonth() + 1,
      ).padStart(2, '0')}-${String(startDate.getDate()).padStart(
        2,
        '0',
      )} ${String(startDate.getHours()).padStart(2, '0')}:${String(
        startDate.getMinutes(),
      ).padStart(2, '0')} 의 운동`,
      ex_distance: distance,
      ex_kcal: distance * 0.6,
      ex_steps: steps,
      ex_start_time: new Date(startTime.current).toLocaleTimeString('en-GB', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }), // 결과 예: "13:42:00"
      ex_end_time: new Date(Date.now()).toLocaleTimeString('en-GB', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      ex_route_image: staticMapUrl || '',
      elapsedSec: elapsedSec,
    };
    // console.log('백에 보낸 운동 기록:', JSON.stringify(newExercise, null, 2));

    postMyExercisesAPI(newExercise)
      .then(async response => {
        const receivedRewards = response.data.rewards || [];
        const exerciseId = response.data.insertId;

        // ✅ 성공 시에만 AsyncStorage 및 상태 초기화
        await AsyncStorage.multiRemove([
          'running_start_time',
          'running_paused_time',
          'running_pause_start',
        ]);

        stopTimer();
        setIsRunning(false);
        setElapsedSec(0);
        setDistance(0);
        setSteps(0);
        setRoute([]);
        // setPrevLocation(null);
        pausedTimeAccum.current = 0;
        pauseStartTime.current = null;

        navigation.replace('Result', {
          distance,
          steps,
          elapsedSec,
          Kcal: distance * 0.6,
          startTime: formattedStartTime,
          staticMapUrl,
          rewards: receivedRewards,
          exerciseId,
        });
      })
      .catch(error => {
        console.error('운동 기록 저장 실패:', error);
        Alert.alert('저장 실패', '운동 기록을 저장하지 못했습니다.', [
          {
            text: '다시 시도',
            onPress: () => handleStopButtonPress(), // 🔄 재시도
          },
          {
            text: '나중에',
            style: 'cancel',
            onPress: () => {
              // 🔄 운동 재개 상태로 복원
              setIsRunning(true);
              startTimer();
            },
          },
        ]);
        Alert.alert(error);
      });
  };

  //steps 변화에 따라 실시간으로 kcal도 변화하도록
  useEffect(() => {
    const newKcal = Math.floor(distance * 0.6);
    setKcal(newKcal);
  }, [distance]);

  return (
    <Wrapper isRunning={isRunning}>
      <RecordsContainer isRunning={isRunning}>
        <Category>
          <Value isRunning={isRunning}>{(distance / 1000).toFixed(2)}</Value>
          <CategoryText isRunning={isRunning}>Km</CategoryText>
        </Category>
        <Category>
          <Value isRunning={isRunning}>{addComma(steps)}</Value>
          <CategoryText isRunning={isRunning}>Step</CategoryText>
        </Category>
        <Category>
          <Value isRunning={isRunning}>{kcal.toFixed(2)}</Value>
          <CategoryText isRunning={isRunning}>Kcal</CategoryText>
        </Category>
        {/* <Button onPress={handleClearToken} title="토큰삭제" /> */}
      </RecordsContainer>
      <Main>
        <TimeContainer>
          <Time isRunning={isRunning}>{formatTime(elapsedSec)}</Time>
        </TimeContainer>

        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={{width: '100%', height: '100%'}}
          showsUserLocation={true}
          followsUserLocation={true}
          initialRegion={
            initialRegion ?? {
              latitude: 37.5665,
              longitude: 126.978,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }
          }
        />
        <ButtonContainer>
          {isRunning ? (
            <RunningButton option="pause" onPress={handleRunningButtonPress} />
          ) : (
            <>
              <RunningButton option="stop" onPress={handleStopButtonPress} />
              <RunningButton
                option="start"
                onPress={handleRunningButtonPress}
              />
            </>
          )}
        </ButtonContainer>
      </Main>
    </Wrapper>
  );
};

export default RunningScreen;

const Wrapper = styled.View<{isRunning: boolean}>`
  height: 100%;
  width: 100%;
  background-color: ${({isRunning}) => (isRunning ? '#ffffff' : '#ffffff')};
`;

const RecordsContainer = styled.View<{isRunning: boolean}>`
  width: 100%;
  height: 12%;
  position: absolute;
  z-index: 1;
  flex-direction: row;
  justify-content: space-between;
  background-color: ${({isRunning}) => (isRunning ? '#ffffff' : '#1a1a1a')};
  justify-content: center;
  align-items: center;
`;
const Category = styled.View`
  width: 33%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;
const Value = styled.Text<{isRunning: boolean}>`
  font-size: 27px;
  color: ${({isRunning}) => (isRunning ? '#1a1a1a' : '#ffffff')};
  font-weight: bold;
  text-align: center;
`;
const CategoryText = styled.Text<{isRunning: boolean}>`
  font-size: 15px;
  color: ${({isRunning}) => (isRunning ? '#1a1a1a' : '#ffffff')};
  text-align: center;
`;

const Main = styled.View`
  height: 100%;
  justify-content: space-between;
  align-items: center;
`;

const TimeContainer = styled.View`
  z-index: 1;
  position: absolute;
  bottom: 520px;
  left: 0;
  right: 0;
  /* height: 20%; */
  justify-content: center;
  align-items: center;
`;
const Time = styled.Text<{isRunning: boolean}>`
  font-size: 75px;
  font-style: italic;
  font-weight: bold;
  text-align: center;
  color: ${({isRunning}) => (isRunning ? '#00f48a' : '#1a1a1a')};
`;

const ButtonContainer = styled.View`
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  align-items: center;
  height: 20%;
  flex-direction: row;
  justify-content: center;
  gap: 70px;
`;
