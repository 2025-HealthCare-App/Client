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
import {map, filter} from 'rxjs/operators';
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
  // 🚀 타이머 함수
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
  }, [isRunning]);

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
  const [prevLocation, setPrevLocation] = useState<{
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

        // ✅ getCurrentPosition 제거

        // 걸음 센서
        setUpdateIntervalForType(SensorTypes.accelerometer, 400);
        const sensorSub = accelerometer
          .pipe(
            map(({x, y, z}) => Math.sqrt(x * x + y * y + z * z)),
            filter(mag => mag > 12),
          )
          .subscribe(() => {
            setSteps(prev => prev + 1); // 이렇게!
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
              setPrevLocation({latitude, longitude});
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

            if (prevLocation) {
              const d = getDistance(
                prevLocation.latitude,
                prevLocation.longitude,
                latitude,
                longitude,
              );
              setDistance(prev => prev + d);
            }

            setPrevLocation({latitude, longitude});
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

  //운동 종료 처리하는 함수
  const apiKey = Config.MAPS_API_KEY;
  const handleStopButtonPress = () => {
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
      ex_kcal: steps * 0.04,
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
    console.log('운동 기록:', JSON.stringify(newExercise, null, 2));

    postMyExercisesAPI(newExercise)
      .then(async response => {
        const receivedRewards = response.data.rewards || [];

        // ✅ AsyncStorage 값 삭제 (완전 초기화)
        await AsyncStorage.multiRemove([
          'running_start_time',
          'running_paused_time',
          'running_pause_start',
        ]);

        // ✅ 저장 성공 시에만 상태 초기화
        stopTimer(); // 타이머 완전 정지
        setIsRunning(false);
        setElapsedSec(0); // 타이머 초기화
        setDistance(0); // 거리 초기화
        setSteps(0); // 스텝 초기화
        setRoute([]); // 경로 초기화
        setPrevLocation(null); // 위치 초기화
        pausedTimeAccum.current = 0;
        pauseStartTime.current = null;

        navigation.replace('Result', {
          distance,
          steps,
          elapsedSec,
          Kcal: steps * 0.04,
          startTime: formattedStartTime,
          staticMapUrl,
          rewards: receivedRewards,
        });
      })
      .catch(error => {
        console.error('운동 기록 저장 실패:', error);
        Alert.alert(
          '저장 실패',
          '네트워크 문제로 운동 기록을 저장하지 못했습니다.\n다시 시도해주세요.',
        );
      });
  };

  //steps 변화에 따라 실시간으로 kcal도 변화하도록
  useEffect(() => {
    const newKcal = Math.floor(steps * 0.04);
    setKcal(newKcal);
  }, [steps]);

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
          <Value isRunning={isRunning}>
            {addComma(Number(kcal.toFixed(1)))}
          </Value>
          <CategoryText isRunning={isRunning}>Kcal</CategoryText>
        </Category>
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
  /* padding: 50px 0; */
  background-color: ${({isRunning}) => (isRunning ? '#ffffff' : '#ffffff')};
`;

const RecordsContainer = styled.View<{isRunning: boolean}>`
  width: 100%;
  height: 12%;
  position: absolute;
  z-index: 1;
  flex-direction: row;
  justify-content: space-between;
  background-color: ${({isRunning}) => (isRunning ? '#ffffff' : '#171b21')};
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
  color: ${({isRunning}) => (isRunning ? '#171b21' : '#ffffff')};
  font-weight: bold;
  text-align: center;
`;
const CategoryText = styled.Text<{isRunning: boolean}>`
  font-size: 15px;
  color: ${({isRunning}) => (isRunning ? '#171b21' : '#ffffff')};
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
  color: ${({isRunning}) => (isRunning ? '#CDD800' : '#171b21')};
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
