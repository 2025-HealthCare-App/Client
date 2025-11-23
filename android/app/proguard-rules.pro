# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# --------------------------------------------------------------------------
# 1. React Native Background Geolocation (TransistorSoft) 필수 규칙
# --------------------------------------------------------------------------
-keep class com.transistorsoft.** { *; }
-dontwarn com.transistorsoft.**

# --------------------------------------------------------------------------
# 2. Google Play Services (위치 서비스) 필수 규칙
# --------------------------------------------------------------------------
# 위치 서비스를 불러올 때 이 부분이 난독화되면 앱이 위치 기능을 못 찾고 죽습니다.
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.android.gms.**

# --------------------------------------------------------------------------
# 3. EventBus (라이브러리 내부 통신용) 필수 규칙
# --------------------------------------------------------------------------
# 이 라이브러리는 내부적으로 EventBus를 사용하므로 이 규칙이 없으면 초기화에 실패합니다.
-keepattributes *Annotation*
-keepclassmembers class * {
    @org.greenrobot.eventbus.Subscribe <methods>;
}
-keep enum org.greenrobot.eventbus.ThreadMode { *; }

# --------------------------------------------------------------------------
# 4. 기타 안전장치 (AndroidX 등)
# --------------------------------------------------------------------------
-keep class androidx.** { *; }
-keep class android.support.** { *; }
-dontwarn androidx.**