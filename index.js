/**
 * @format
 */
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// ▼▼▼ 1. 라이브러리 임포트 ▼▼▼
import BackgroundGeolocation from 'react-native-background-geolocation';

// ▼▼▼ 2. HeadlessTask 정의 (필수!) ▼▼▼
// 앱이 꺼져있거나 백그라운드일 때 위치 이벤트를 여기서 받습니다.
const HeadlessTask = async event => {
  let params = event.params;
  console.log('[HeadlessTask] -', event.name, params);

  // 예: 위치가 갱신되었을 때 처리
  if (event.name === 'location') {
    // console.log('[HeadlessTask] Location:', params);
  }
};

// ▼▼▼ 3. 등록 (AppRegistry 바로 윗줄에 넣어주세요) ▼▼▼
BackgroundGeolocation.registerHeadlessTask(HeadlessTask);
// ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

AppRegistry.registerComponent(appName, () => App);
