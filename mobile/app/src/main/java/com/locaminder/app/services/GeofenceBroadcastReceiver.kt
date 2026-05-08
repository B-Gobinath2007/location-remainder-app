package com.locaminder.app.services

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class GeofenceBroadcastReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        // Implementation can be handled via GeofencingApi here if LocationForegroundService is disabled
    }
}
