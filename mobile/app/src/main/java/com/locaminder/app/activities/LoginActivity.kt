package com.locaminder.app.activities

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.locaminder.app.R
import com.locaminder.app.databinding.ActivityLoginBinding
import com.locaminder.app.models.AuthRequest
import com.locaminder.app.network.RetrofitClient
import com.locaminder.app.network.SessionManager
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class LoginActivity : AppCompatActivity() {

    private lateinit binding: ActivityLoginBinding
    private lateinit var sessionManager: SessionManager
    private var isLoginMode = true

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        sessionManager = SessionManager(this)

        if (sessionManager.isLoggedIn()) {
            startActivity(Intent(this, DashboardActivity::class.java))
            finish()
            return
        }

        setupListeners()
    }

    private fun setupListeners() {
        binding.toggleActionText.setOnClickListener {
            isLoginMode = !isLoginMode
            updateUI()
        }

        binding.actionButton.setOnClickListener {
            performAuth()
        }
    }

    private fun updateUI() {
        if (isLoginMode) {
            binding.titleText.text = getString(R.string.welcome_back)
            binding.subtitleText.text = "Sign in to access your reminders"
            binding.actionButton.text = getString(R.string.sign_in)
            binding.togglePromptText.text = getString(R.string.no_account)
            binding.toggleActionText.text = getString(R.string.sign_up)
        } else {
            binding.titleText.text = getString(R.string.create_account)
            binding.subtitleText.text = "Sign up to start tracking locations"
            binding.actionButton.text = getString(R.string.sign_up)
            binding.togglePromptText.text = getString(R.string.has_account)
            binding.toggleActionText.text = getString(R.string.sign_in)
        }
    }

    private fun performAuth() {
        val username = binding.usernameInput.text.toString().trim()
        val password = binding.passwordInput.text.toString().trim()

        if (username.isEmpty() || password.isEmpty()) {
            Toast.makeText(this, getString(R.string.error_empty_fields), Toast.LENGTH_SHORT).show()
            return
        }

        setLoading(true)

        val apiService = RetrofitClient.getClient(sessionManager)
        val request = AuthRequest(username, password)

        lifecycleScope.launch(Dispatchers.IO) {
            try {
                val response = if (isLoginMode) {
                    apiService.login(request)
                } else {
                    apiService.register(request)
                }

                withContext(Dispatchers.Main) {
                    setLoading(false)
                    if (response.isSuccessful && response.body() != null) {
                        if (isLoginMode) {
                            val token = response.body()?.token
                            if (token != null) {
                                sessionManager.saveToken(token)
                                startActivity(Intent(this@LoginActivity, DashboardActivity::class.java))
                                finish()
                            }
                        } else {
                            Toast.makeText(this@LoginActivity, "Registration successful. Please log in.", Toast.LENGTH_SHORT).show()
                            isLoginMode = true
                            updateUI()
                        }
                    } else {
                        Toast.makeText(this@LoginActivity, "Failed: ${response.message()}", Toast.LENGTH_SHORT).show()
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    setLoading(false)
                    Toast.makeText(this@LoginActivity, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    private fun setLoading(isLoading: Boolean) {
        binding.actionButton.text = if (isLoading) "" else (if (isLoginMode) getString(R.string.sign_in) else getString(R.string.sign_up))
        binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        binding.actionButton.isEnabled = !isLoading
        binding.usernameInput.isEnabled = !isLoading
        binding.passwordInput.isEnabled = !isLoading
    }
}
