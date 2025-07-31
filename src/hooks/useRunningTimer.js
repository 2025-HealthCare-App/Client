import {useState, useRef, useEffect} from 'react';
import {AppState} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useRunningTimer(isRunning) {
  const [elapsedSec, setElapsedSec] = useState(0);
  const intervalRef = useRef(null);
  const startTime = useRef(new Date().getTime());
  const appState = useRef(AppState.currentState);
  const pausedTimeAccum = useRef(0);
  const pauseStartTime = useRef(null);

  const startTimer = () => {
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

  useEffect(() => {
    if (isRunning) {
      startTimer();
    } else {
      stopTimer();
    }
    return () => stopTimer();
  }, [isRunning]);

  return {
    elapsedSec,
    startTime,
    pausedTimeAccum,
    pauseStartTime,
    startTimer,
    stopTimer,
    setElapsedSec,
  };
}
