import {useState, useRef, useEffect} from 'react';
import {Platform, PermissionsAndroid} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {
  setUpdateIntervalForType,
  SensorTypes,
  accelerometer,
} from 'react-native-sensors';
import {map, filter} from 'rxjs/operators';
import {getDistance} from 'geolib';

export default function useRunningMap() {
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  const [prevLocation, setPrevLocation] = useState(null);
  const [route, setRoute] = useState([]);
  const [initialRegion, setInitialRegion] = useState(undefined);
  const mapRef = useRef(null);
  const watchId = useRef(null);

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

        Geolocation.getCurrentPosition(
          position => {
            const {latitude, longitude} = position.coords;
            setInitialRegion({
              latitude,
              longitude,
              latitudeDelta: 0.001,
              longitudeDelta: 0.001,
            });
            setPrevLocation({latitude, longitude});
            setRoute([{latitude, longitude}]);
          },
          error => console.warn('초기 위치 못 가져옴:', error),
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 1000},
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
      });

    // 위치 추적
    watchId.current = Geolocation.watchPosition(
      position => {
        const {latitude, longitude, accuracy} = position.coords;
        if (accuracy > 10) {
          return;
        }

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

        mapRef.current?.animateToRegion(
          {latitude, longitude, latitudeDelta: 0.001, longitudeDelta: 0.001},
          500,
        );
      },
      error => console.warn('Location error:', error),
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

  return {
    steps,
    distance,
    route,
    initialRegion,
    prevLocation,
    setPrevLocation,
    mapRef,
  };
}
