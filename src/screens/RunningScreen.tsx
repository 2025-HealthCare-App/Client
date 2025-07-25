import styled from 'styled-components/native';
import RunningButton from '../components/runningScreen/RunningButton';
import React, {useEffect, useRef, useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {
  SensorTypes,
  setUpdateIntervalForType,
  accelerometer,
} from 'react-native-sensors';
import Geolocation from 'react-native-geolocation-service';
import MapView, {Polyline, Marker, Region} from 'react-native-maps';
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
type RootStackParamList = {
  Running: undefined;
  Result: {
    distance: number;
    steps: number;
    elapsedSec: number;
    Kcal: number;
    startTime: string;
    staticMapUrl: string;
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

  ////지도 부분///////
  const [steps, setSteps] = useState(0);
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

  const [initialRegion, setInitialRegion] = useState<Region | null>(null);

  //이동 관련 useEffect
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

        // useEffect 내부: 위치 권한 요청 후 최초 1회 위치 가져오기
        Geolocation.getCurrentPosition(
          position => {
            const {latitude, longitude} = position.coords;
            setInitialRegion({
              latitude,
              longitude,
              latitudeDelta: 0.001,
              longitudeDelta: 0.001,
            });

            // 초기 위치도 prevLocation과 route에 추가
            setPrevLocation({latitude, longitude});
            setRoute([{latitude, longitude}]);
          },
          error => {
            console.warn('초기 위치 못 가져옴:', error);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 1000,
          },
        );
      }
    };
    requestPermissions();

    // 걸음 센서
    setUpdateIntervalForType(SensorTypes.accelerometer, 400);
    let localSteps = 0;
    const sensorSub = accelerometer
      .pipe(
        map(({x, y, z}) => Math.sqrt(x * x + y * y + z * z)),
        filter(mag => mag > 12),
      )
      .subscribe(() => {
        localSteps++;
        setSteps(localSteps);
        console.log('Step!', localSteps);
      });

    // 위치 추적
    watchId.current = Geolocation.watchPosition(
      position => {
        const {latitude, longitude, accuracy} = position.coords;

        console.log('GPS', latitude, longitude);
        console.log('Accuracy', accuracy);

        // ✅ 정확도가 낮으면 무시
        // if (accuracy > 10) {
        //   console.log(`Ignored due to low accuracy (${accuracy}m)`);
        //   return;
        // }

        if (prevLocation) {
          const d = getDistance(
            prevLocation.latitude,
            prevLocation.longitude,
            latitude,
            longitude,
          );

          setDistance(prev => prev + d);
          console.log(`Moved ${d.toFixed(2)} m`);
        }

        setPrevLocation({latitude, longitude});
        setRoute(prev => [...prev, {latitude, longitude}]);

        // 📍 지도 카메라 따라가기
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
  }, [prevLocation]);

  // 타이머 관련 useEffect
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedSec(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]); // 💡 isRunning을 의존성에 추가!

  const handleRunningButtonPress = () => {
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
      ex_end_time: new Date(startTime.current).toLocaleTimeString('en-GB', {
        hour12: false, // 24시간제
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }), // 결과 예: "13:42:00"
      ex_route_image: staticMapUrl || '',
    };
    console.log('운동 기록:', JSON.stringify(newExercise, null, 2));
    postMyExercisesAPI(newExercise)
      .then(response => {
        console.log('운동 기록 저장 성공:', response.data);
      })
      .catch(error => {
        console.error('운동 기록 저장 실패:', error);
      });

    //다음 페이지로 값들을 전달
    navigation.replace('Result', {
      distance: distance,
      steps: steps,
      elapsedSec: elapsedSec,
      Kcal: steps * 0.04,
      startTime: formattedStartTime,
      staticMapUrl: staticMapUrl,
    });
    //타이머 정지
    setIsRunning(false);
    setElapsedSec(0); // 타이머 초기화
    setDistance(0); // 거리 초기화 (선택)
    setSteps(0); // 스텝 초기화 (선택)
    setRoute([]); // 경로 초기화 (선택)
    setPrevLocation(null); // 위치 초기화 (선택)
  };

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
          <Value isRunning={isRunning}>{addComma(steps * 0.04)}</Value>
          {/* Kcal 계산식 */}
          <CategoryText isRunning={isRunning}>Kcal</CategoryText>
        </Category>
      </RecordsContainer>
      <Main>
        <TimeContainer>
          <Time isRunning={isRunning}>{formatTime(elapsedSec)}</Time>
        </TimeContainer>

        <MapView
          ref={mapRef}
          style={{width: '100%', height: '100%'}}
          showsUserLocation={true}
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
  elevation: 10;
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
