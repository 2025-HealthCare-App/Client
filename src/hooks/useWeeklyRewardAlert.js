// hooks/useWeeklyRewardAlert.js
import {useEffect} from 'react';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import {getWeeklyRewardStatusAPI} from '../apis/user/tierRewardAPI';
import {convertTierToText} from '../utils/tierUtil';

export default function useWeeklyRewardAlert() {
  useEffect(() => {
    const checkWeeklyReward = async () => {
      try {
        const today = dayjs();
        const currentWeek = today
          .startOf('week')
          .add(1, 'day')
          .format('YYYY-MM-DD');
        const lastShownWeek = await AsyncStorage.getItem('lastRewardAlertWeek');

        // 이미 이번 주 알림을 본 적 있으면 종료
        if (lastShownWeek === currentWeek) {
          console.log(
            '이번 주 알림을 이미 본 적이 있어요. 알림을 표시하지 않음.',
            lastShownWeek,
            currentWeek,
          );
          return;
        }

        const res = await getWeeklyRewardStatusAPI();
        console.log('주간 보상 상태:', res);

        if (res.success && res.received) {
          Alert.alert(
            '주간 보상 지급',
            `저번 주 티어는 '${convertTierToText(res.tier)}'(으)로,
            ${res.rewardPoints} P를 받았어요!`,
          );

          // 이번 주 알림 본 주차 저장
          await AsyncStorage.setItem('lastRewardAlertWeek', currentWeek);
          console.log('이번 주 알림을 본 주차를 저장 완료', currentWeek);
        }
      } catch (err) {
        console.error('주간 보상 알림 체크 실패:', err);
      }
    };

    checkWeeklyReward();
  }, []);
}
