package com.anonymous.SlientTalkUI

import android.app.Activity
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import vn.zalopay.sdk.ZaloPaySDK
import vn.zalopay.sdk.listeners.PayOrderListener
import vn.zalopay.sdk.ZaloPayError

class PayZaloBridgeModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private val reactContext = reactContext

    override fun getName(): String {
        return "PayZaloBridgeModule"
    }

    @ReactMethod
    fun payOrder(zpToken: String, uriScheme: String, promise: Promise) {
        val currentActivity = reactApplicationContext.currentActivity
        if (currentActivity == null) {
            promise.reject("NO_ACTIVITY", "Current activity is null")
            return
        }
        ZaloPaySDK.getInstance().payOrder(currentActivity, zpToken, uriScheme, object : PayOrderListener {
            override fun onPaymentCanceled(zpTransToken: String?, appTransID: String?) {
                val params = Arguments.createMap().apply {
                    putInt("errorCode", 4)
                    putString("zpTranstoken", zpTransToken)
                    putString("appTransId", appTransID)
                }
                sendEvent("EventPayZalo", params)
                promise.resolve("canceled")
            }

            override fun onPaymentError(zaloPayError: ZaloPayError?, zpTransToken: String?, appTransID: String?) {
                val params = Arguments.createMap().apply {
                    val errorCode = when (zaloPayError) {
                        ZaloPayError.UNKNOWN -> -1
                        ZaloPayError.PAYMENT_APP_NOT_FOUND -> 1
                        ZaloPayError.INPUT_IS_INVALID -> 2
                        ZaloPayError.EMPTY_RESULT -> 3
                        ZaloPayError.FAIL -> 4
                        null -> -1
                    }
                    putInt("errorCode", errorCode)
                    putString("message", zaloPayError?.name ?: "Unknown error")
                    putString("zpTranstoken", zpTransToken)
                    putString("appTransId", appTransID)
                }
                sendEvent("EventPayZalo", params)
                // promise.resolve("error")
                promise.reject("PAYMENT_ERROR", zaloPayError?.name ?: "Unknown error")
            }

            override fun onPaymentSucceeded(transactionId: String, transToken: String, appTransID: String?) {
                val params = Arguments.createMap().apply {
                    putInt("errorCode", 0)
                    putString("transactionId", transactionId)
                    putString("zpTranstoken", transToken)
                    putString("appTransId", appTransID)
                }
                sendEvent("EventPayZalo", params)
                promise.resolve("success")
            }
        })
    }

    private fun sendEvent(eventName: String, params: WritableMap) {
        reactContext
            .getJSModule(RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }
}
