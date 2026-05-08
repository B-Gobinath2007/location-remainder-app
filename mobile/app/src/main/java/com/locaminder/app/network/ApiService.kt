package com.locaminder.app.network

import com.locaminder.app.models.AuthRequest
import com.locaminder.app.models.AuthResponse
import com.locaminder.app.models.Reminder
import com.locaminder.app.models.ReminderRequest
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface ApiService {
    @POST("api/auth/register")
    suspend fun register(@Body request: AuthRequest): Response<AuthResponse>

    @POST("api/auth/login")
    suspend fun login(@Body request: AuthRequest): Response<AuthResponse>

    @GET("api/reminders")
    suspend fun getReminders(): Response<List<Reminder>>

    @POST("api/reminders")
    suspend fun createReminder(@Body request: ReminderRequest): Response<Reminder>

    @DELETE("api/reminders/{id}")
    suspend fun deleteReminder(@Path("id") id: String): Response<Void>
}
