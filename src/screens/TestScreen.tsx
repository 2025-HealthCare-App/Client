import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  PermissionsAndroid,
  Platform,
  StyleSheet,
} from 'react-native';
import {
  SensorTypes,
  setUpdateIntervalForType,
  accelerometer,
} from 'react-native-sensors';
import Geolocation from 'react-native-geolocation-service';
import MapView, {Polyline, Marker} from 'react-native-maps';
import {map, filter} from 'rxjs/operators';

const TestScreen = () => {
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0); // meter
  const [prevLocation, setPrevLocation] = useState(null);
  const watchId = useRef(null);
  const [route, setRoute] = useState([]);

  // 거리 계산 함수 (Haversine)
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const toRad = deg => (deg * Math.PI) / 180;
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

    // 📦 센서 설정
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

    // 📡 위치 추적
    watchId.current = Geolocation.watchPosition(
      position => {
        //백그라운드에서 계속 GPS수싱늘 대기하고 있다가, 위치 정보가 바뀌면 자동으로 콜백 함수를 실행
        const {latitude, longitude, accuracy} = position.coords;

        // ✅ 여기에 로그 추가!
        console.log('GPS', latitude, longitude);
        console.log('Accuracy', accuracy);

        if (prevLocation) {
          const d = getDistance(
            prevLocation.latitude,
            prevLocation.longitude,
            latitude,
            longitude,
          );

          const THRESHOLD = 2.5; // ❤️2.5m 이하 변화는 무시
          if (d < THRESHOLD) {
            console.log(`Ignored small movement: ${d.toFixed(2)} m`);
            return; // 이동 거리가 너무 작으면 무시
          }

          setDistance(prev => prev + d);
          console.log(`Moved ${d.toFixed(2)} m`);
        }
        setPrevLocation({latitude, longitude});
        setRoute(prev => [...prev, {latitude, longitude}]);
      },
      error => {
        console.warn('Location error:', error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 1,
        interval: 3000,
        fastestInterval: 2000,
      },
    );

    return () => {
      sensorSub.unsubscribe();
      if (watchId.current) {
        Geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

  return (
    <View style={{flex: 1}}>
      <MapView
        style={{flex: 1}}
        initialRegion={{
          latitude: route[0]?.latitude || 37.5665,
          longitude: route[0]?.longitude || 126.978,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        }}>
        {route.length > 0 && (
          <>
            <Polyline coordinates={route} strokeWidth={4} />
            <Marker coordinate={route[route.length - 1]} />
          </>
        )}
      </MapView>
      <View style={styles.overlay}>
        <Text>걸음 수: {steps}</Text>
        <Text>이동 거리: {(distance / 1000).toFixed(2)} km</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  label: {fontSize: 20, fontWeight: '600', marginVertical: 10},
});

export default TestScreen;
