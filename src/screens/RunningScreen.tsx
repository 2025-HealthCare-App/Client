import styled from 'styled-components/native';
import RunningButton from '../components/runningScreen/RunningButton';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  AppState,
  BackHandler,
  Text,
} from 'react-native';
import {
  SensorTypes,
  setUpdateIntervalForType,
  accelerometer,
} from 'react-native-sensors';
import MapView, {Region, PROVIDER_GOOGLE} from 'react-native-maps';
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
import BackgroundGeolocation, {
  Subscription,
} from 'react-native-background-geolocation';
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
  // 🔴 [추가 1] 위치 수신 대기 상태 (True면 로딩 중)
  const [isLocating, setIsLocating] = useState(true);

  ///타이머
  const [elapsedSec, setElapsedSec] = useState(0); // 총 초
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
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
    // 🔴 [수정] 위치를 찾기 전(isLocating)이면 타이머 돌지 않음
    if (isLocating) {
      return;
    }

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

  // 🚀 [추가] 위치를 찾으면(isLocating이 false가 되면) 그때 타이머 시작
  useEffect(() => {
    if (!isLocating && isRunning) {
      // 시작 시간을 현재(위치 잡힌 시점)로 재설정하고 싶다면 여기서 startTime.current를 업데이트 할 수도 있음.
      // 여기서는 단순히 타이머만 시작시킴.
      startTimer();
    }
  }, [isLocating, isRunning]);

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

  // 1. 이동 및 위치 추적 관련 useEffect
  useEffect(() => {
    let onLocation: Subscription;

    // 🔴 [수정 1] 시작할 때 무조건 초기화 (이전 운동 기억 삭제)
    prevLocation.current = null;
    setRoute([]);
    setDistance(0);
    setIsLocating(true);

    const initGeolocation = async () => {
      // ---------------- [1] 위치 이벤트 리스너 ----------------
      onLocation = BackgroundGeolocation.onLocation(
        location => {
          const {latitude, longitude} = location.coords;
          const accuracy = location.coords.accuracy;

          // 🔴 [수정 2] 데이터의 신선도 체크 (Timestamp Filter)
          // 위치 데이터의 시간과 현재 시간의 차이가 10초(10000ms) 이상이면 "옛날 데이터"로 보고 무시
          const locationTime = new Date(location.timestamp).getTime();
          const now = Date.now();
          if (now - locationTime > 10000) {
            console.log('[GPS] 너무 오래된 캐시 데이터라 무시함');
            return;
          }

          // 정확도 필터 (30m)
          if (accuracy > 30) {
            return;
          }

          // 1. 첫 위치 설정 (로딩 해제)
          if (!prevLocation.current) {
            console.log('[GPS] 첫 위치 확보 완료 -> 카운트 시작');

            setInitialRegion({
              latitude,
              longitude,
              latitudeDelta: 0.002,
              longitudeDelta: 0.002,
            });
            prevLocation.current = {latitude, longitude};
            setRoute([{latitude, longitude}]);

            // 지도 이동
            mapRef.current?.animateToRegion(
              {
                latitude,
                longitude,
                latitudeDelta: 0.002,
                longitudeDelta: 0.002,
              },
              500,
            );

            // 🔴 [핵심 1] 로딩 상태 해제 -> 이때부터 화면이 보이고 타이머가 돔
            setIsLocating(false);
            return;
          }

          // 2. 이동 중 로직
          const d = getDistance(
            prevLocation.current.latitude,
            prevLocation.current.longitude,
            latitude,
            longitude,
          );

          // 순간이동 방지 (50m)
          if (d > 50) {
            console.log(
              `[GPS] 튀는 값(${d.toFixed(
                2,
              )}m) -> 기준점만 갱신하고 거리는 안 더함`,
            );
            // 🔴 기준점은 현재 위치로 잡아줘야, 다음번 계산 때 정상 거리가 나옵니다.
            prevLocation.current = {latitude, longitude};
            return;
          }

          // 0.5m 이상 이동 시 반영 (노이즈 필터)
          if (d > 0.5) {
            console.log(
              `[GPS] 이동: +${d.toFixed(2)}m (총 ${distance.toFixed(2)}m)`,
            );

            setDistance(prev => prev + d);
            setRoute(prev => [...prev, {latitude, longitude}]);
            prevLocation.current = {latitude, longitude};

            mapRef.current?.animateToRegion(
              {
                latitude,
                longitude,
                latitudeDelta: 0.002,
                longitudeDelta: 0.002,
              },
              500,
            );
          }
        },
        error => {
          console.log('[Background] Location Error:', error);
        },
      );

      // ---------------- [2] 라이브러리 설정 ----------------
      try {
        const state = await BackgroundGeolocation.ready({
          reset: true,
          desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
          distanceFilter: 5,
          locationUpdateInterval: 1000,
          fastestLocationUpdateInterval: 1000,

          stopOnTerminate: false,
          startOnBoot: false,
          debug: false,
          logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,

          // 충돌 방지 설정
          disableMotionActivityUpdates: true,
          disableStopDetection: true,
          locationAuthorizationRequest: 'WhenInUse',
          disableLocationAuthorizationAlert: true,

          notification: {
            title: '러닝 기록 중',
            text: '열심히 달리고 계시네요! 🏃',
            smallIcon: 'ic_notification',
            channelName: 'RunningLocationChannel_v2',
          },
        });

        if (!state.enabled) {
          await BackgroundGeolocation.start();
          await BackgroundGeolocation.changePace(true); // 강제 이동 모드
          console.log('- 위치 추적 시작됨');
        }
      } catch (e) {
        console.error('- 위치 서비스 에러:', e);
        Alert.alert('오류', '위치 서비스를 시작할 수 없습니다.');
        navigation.goBack();
      }
    };

    // 센서 로직 (생략 - 기존 유지)
    setUpdateIntervalForType(SensorTypes.accelerometer, 100);
    const sensorSub = accelerometer
      .pipe(
        map(({x, y, z}) => Math.sqrt(x * x + y * y + z * z)),
        filter(mag => mag > 11.5),
        throttleTime(350),
      )
      .subscribe(() => setSteps(prev => prev + 1));

    initGeolocation();

    return () => {
      onLocation?.remove();
      sensorSub.unsubscribe();
      BackgroundGeolocation.stop();
      // 🔴 [수정 3] 클린업 시 변수 완전 초기화
      prevLocation.current = null;
    };
  }, [navigation]);

  // pause 상태 시작 시
  const handleRunningButtonPress = async () => {
    if (isRunning) {
      // [운동 → 일시정지]
      pauseStartTime.current = Date.now();
      await AsyncStorage.setItem(
        'running_pause_start',
        String(pauseStartTime.current),
      );
      stopTimer();

      // ▼▼▼ [추가] 위치 추적 일시 중지 ▼▼▼
      await BackgroundGeolocation.stop();
    } else {
      // [일시정지 → 운동 재개]
      const pauseStart =
        pauseStartTime.current ??
        parseInt(
          (await AsyncStorage.getItem('running_pause_start')) || '0',
          10,
        );
      if (pauseStart) {
        pausedTimeAccum.current += Math.floor((Date.now() - pauseStart) / 1000);
      }
      startTimer();

      // ▼▼▼ [추가] 위치 추적 다시 시작 ▼▼▼
      await BackgroundGeolocation.start();
    }
    setIsRunning(prev => !prev);
  };

  //!!운동 종료 처리하는 함수!!
  const apiKey = Config.MAPS_API_KEY;
  const handleStopButtonPress = () => {
    // ▼▼▼ [추가] 위치 추적 완전 종료 ▼▼▼
    BackgroundGeolocation.stop();

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
      ex_kcal: Math.round(distance * 0.05),
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
          Kcal: Math.round(distance * 0.05),
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
              BackgroundGeolocation.start();
            },
          },
        ]);
        Alert.alert(error);
      });
  };

  //distance 변화에 따라 실시간으로 kcal도 변화하도록
  useEffect(() => {
    //소수점 버림
    const newKcal = Math.round(distance * 0.05);
    setKcal(newKcal);
  }, [distance]);

  // 👇 뒤로가기 버튼 제어 (운동 중 실수로 종료 방지)
  useEffect(() => {
    const backAction = () => {
      if (isRunning) {
        Alert.alert(
          '운동 종료',
          '운동 기록이 저장되지 않습니다.\n정말 종료하시겠습니까?',
          [
            {
              text: '취소',
              onPress: () => null, // 아무 동작 안 함
              style: 'cancel',
            },
            {
              text: '종료',
              onPress: () => {
                // 필요한 정리 작업 후 뒤로 가기
                // (예: ReactNativeForegroundService.stop() 등은 useEffect cleanup에서 처리됨)
                navigation.goBack();
              },
              style: 'destructive',
            },
          ],
        );
        return true; // true를 반환해야 뒤로가기 동작을 막습니다 (이벤트 소비)
      }
      // 운동 중이 아니면 기본 뒤로가기 동작 허용 (false 반환)
      return false;
    };

    // 리스너 등록
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    // 컴포넌트가 사라질 때 리스너 제거 (필수)
    return () => backHandler.remove();
  }, [isRunning, navigation]);

  // 🔴 [UI 수정] 위치 찾기 전엔 로딩 화면 보여주기
  if (isLocating) {
    return (
      <Wrapper
        isRunning={true}
        style={{justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#00f48a" />
        <Text
          style={{
            marginTop: 20,
            fontSize: 18,
            fontWeight: 'bold',
            color: '#1a1a1a',
          }}>
          GPS 위치를 찾는 중입니다...
        </Text>
        <Text style={{marginTop: 10, color: '#777'}}>
          잠시만 기다려주세요 🏃‍♂️
        </Text>
      </Wrapper>
    );
  }

  return (
    <Wrapper isRunning={isRunning}>
      <RecordsContainer isRunning={isRunning}>
        <Category>
          <Value isRunning={isRunning}>
            {distance < 1000
              ? distance.toFixed(0)
              : (distance / 1000).toFixed(2)}
          </Value>
          <CategoryText isRunning={isRunning}>
            {distance < 1000 ? 'm' : 'Km'}
          </CategoryText>
        </Category>
        <Category>
          <Value isRunning={isRunning}>{addComma(steps)}</Value>
          <CategoryText isRunning={isRunning}>Step</CategoryText>
        </Category>
        <Category>
          <Value isRunning={isRunning}>{kcal}</Value>
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
