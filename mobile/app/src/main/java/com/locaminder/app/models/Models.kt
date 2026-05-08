package com.locaminder.app.models

data class AuthRequest(
    val username: String,
    val password: String
)

data class AuthResponse(
    val token: String?,
    val message: String?
)

data class ReminderRequest(
    val title: String,
    val latitude: Double,
    val longitude: Double,
    val radius: Int
)

data class Reminder(
    val _id: String,
    val userId: String,
    val title: String,
    val latitude: Double,
    val longitude: Double,
    val radius: Int,
    val isActive: Boolean
)
