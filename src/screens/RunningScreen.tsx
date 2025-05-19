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
import MapView, {Polyline, Marker} from 'react-native-maps';
import {map, filter} from 'rxjs/operators';

const RunningScreen = () => {
  const [isRunning, setIsRunning] = useState(true);
  ///타이머
  const [elapsedSec, setElapsedSec] = useState(0); // 총 초
  const intervalRef = useRef<NodeJS.Timer | null>(null);

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

  // 거리 계산 함수 (Haversine)
  const getDistance = (lat1: any, lon1: any, lat2: any, lon2: any) => {
    const R = 6371e3;
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  //시간 포맷팅 함수
  // 초를 시:분:초 형식으로 변환
  const formatTime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

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
        }
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
        if (accuracy > 10) {
          console.log(`Ignored due to low accuracy (${accuracy}m)`);
          return;
        }

        if (prevLocation) {
          const d = getDistance(
            prevLocation.latitude,
            prevLocation.longitude,
            latitude,
            longitude,
          );
          const THRESHOLD = 2.5;
          if (d < THRESHOLD) {
            console.log(`Ignored small movement: ${d.toFixed(2)} m`);
            return;
          }

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
  }, []);
  //////////////////////////////////////////////////////

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

  return (
    <Wrapper isRunning={isRunning}>
      <RecordsContainer isRunning={isRunning}>
        <Category>
          <Value isRunning={isRunning}>{(distance / 1000).toFixed(2)}</Value>
          <CategoryText isRunning={isRunning}>Km</CategoryText>
        </Category>
        <Category>
          <Value isRunning={isRunning}>{steps}</Value>
          <CategoryText isRunning={isRunning}>Step</CategoryText>
        </Category>
        <Category>
          <Value isRunning={isRunning}>TODO</Value>
          <CategoryText isRunning={isRunning}>Kcal</CategoryText>
        </Category>
      </RecordsContainer>
      <Main>
        <TimeContainer>
          <Time>{formatTime(elapsedSec)}</Time>
        </TimeContainer>

        <MapView
          ref={mapRef}
          style={{width: '100%', height: '100%'}}
          showsUserLocation={true}
          initialRegion={{
            latitude: route[0]?.latitude || 37.5665,
            longitude: route[0]?.longitude || 126.978,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
          }}>
          {route.length > 0 && (
            <>
              <Polyline
                coordinates={route}
                strokeWidth={4}
                strokeColor="#007AFF"
              />
              <Marker coordinate={route[route.length - 1]} />
            </>
          )}
        </MapView>
        <ButtonContainer>
          {isRunning ? (
            <RunningButton option="pause" onPress={handleRunningButtonPress} />
          ) : (
            <>
              <RunningButton
                option="stop"
                onPress={() => {
                  setIsRunning(false);
                  setElapsedSec(0);
                }}
              />
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
const Time = styled.Text`
  color: #222831;
  font-size: 75px;
  font-style: italic;
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
