// declarations.d.ts

// react-native-geolocation-service 모듈의 타입을 확장(augmentation)합니다.
declare module 'react-native-geolocation-service' {
  // 기존의 GeoWatchOptions 인터페이스를 찾아서
  // foregroundService 속성추가
  interface GeoWatchOptions {
    foregroundService?: {
      notificationTitle: string;
      notificationText: string;
      notificationColor?: string;
      notificationId?: number;
      channelId?: string;
      notificationIcon?: string;
    };
  }
}
