package com.obesityapp

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader
import androidx.multidex.MultiDexApplication

import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build

class MainApplication : MultiDexApplication(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
          PackageList(this).packages.apply {

          }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()

    // ---------------- 👇 [여기서부터 추가] 알림 채널 생성 (Kotlin 버전) ----------------
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            // 1. JS 코드의 channelId와 똑같이 맞춰야 합니다.
            val channelId = "geolocation_service_channel"
            val channelName = "Running Tracker Channel"
            
            // 2. 채널 생성 (IMPORTANCE_LOW: 소리 없이 알림만 표시)
            val channel = NotificationChannel(
                channelId,
                channelName,
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Used for tracking run location in background"
            }

            // 3. 시스템 서비스에서 매니저 가져오기 & 채널 등록
            val manager = getSystemService(NotificationManager::class.java)
            manager?.createNotificationChannel(channel)
        }
        // ---------------- 🔼 [여기까지 추가] ----------------

    SoLoader.init(this, false)
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      load()
    }
  }
}
