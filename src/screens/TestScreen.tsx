// TestScreen.js or .tsx

import React, {useEffect, useState} from 'react';
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
import {map, filter} from 'rxjs/operators';

const TestScreen = () => {
  const [steps, setSteps] = useState(0);

  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === 'android' && Platform.Version >= 29) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('ACTIVITY_RECOGNITION permission denied');
        }
      }
    };

    requestPermission();

    setUpdateIntervalForType(SensorTypes.accelerometer, 400); // 400ms 주기로 측정

    let localSteps = 0;
    const subscription = accelerometer
      .pipe(
        map(({x, y, z}) => Math.sqrt(x * x + y * y + z * z)),
        filter(magnitude => magnitude > 12), // 임계값 기준 간단한 step 탐지
      )
      .subscribe(() => {
        localSteps++;
        setSteps(localSteps);
      });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>걸음 수: {steps}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default TestScreen;
