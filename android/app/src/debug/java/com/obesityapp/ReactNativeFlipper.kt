// 파일 상단 package 선언 필수!
package com.obesityapp

import android.content.Context
import com.facebook.flipper.android.AndroidFlipperClient
import com.facebook.flipper.plugins.network.NetworkFlipperPlugin
import com.facebook.react.ReactInstanceManager
import com.facebook.soloader.SoLoader

object ReactNativeFlipper {
    fun initializeFlipper(context: Context, reactInstanceManager: ReactInstanceManager) {
        if (BuildConfig.DEBUG) {
            SoLoader.init(context, false)
            val client = AndroidFlipperClient.getInstance(context)
            client.addPlugin(NetworkFlipperPlugin())
            client.start()
        }
    }
}
