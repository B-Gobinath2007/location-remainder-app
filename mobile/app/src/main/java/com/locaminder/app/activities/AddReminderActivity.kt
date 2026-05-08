package com.locaminder.app.activities

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
import android.widget.SeekBar
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import com.google.android.gms.location.LocationServices
import com.locaminder.app.databinding.ActivityAddReminderBinding
import com.locaminder.app.models.ReminderRequest
import com.locaminder.app.network.RetrofitClient
import com.locaminder.app.network.SessionManager
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class AddReminderActivity : AppCompatActivity() {

    private lateinit var binding: ActivityAddReminderBinding
    private lateinit var sessionManager: SessionManager

    private val requestLocationPermission = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        if (isGranted) {
            getCurrentLocation()
        } else {
            Toast.makeText(this, "Location permission denied", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityAddReminderBinding.inflate(layoutInflater)
        setContentView(binding.root)

        sessionManager = SessionManager(this)

        setSupportActionBar(binding.toolbar)
        binding.toolbar.setNavigationOnClickListener { finish() }

        setupUI()
    }

    private fun setupUI() {
        binding.radiusSeekBar.setOnSeekBarChangeListener(object : SeekBar.OnSeekBarChangeListener {
            override fun onProgressChanged(seekBar: SeekBar?, progress: Int, fromUser: Boolean) {
                binding.radiusValueText.text = "${progress}m"
            }
            override fun onStartTrackingTouch(seekBar: SeekBar?) {}
            override fun onStopTrackingTouch(seekBar: SeekBar?) {}
        })

        binding.btnCurrentLocation.setOnClickListener {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                getCurrentLocation()
            } else {
                requestLocationPermission.launch(Manifest.permission.ACCESS_FINE_LOCATION)
            }
        }

        binding.btnSave.setOnClickListener {
            saveReminder()
        }
    }

    private fun getCurrentLocation() {
        val fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
        try {
            fusedLocationClient.lastLocation.addOnSuccessListener { location ->
                if (location != null) {
                    binding.latInput.setText(location.latitude.toString())
                    binding.lngInput.setText(location.longitude.toString())
                } else {
                    Toast.makeText(this, "Could not fetch location", Toast.LENGTH_SHORT).show()
                }
            }
        } catch (e: SecurityException) {
            e.printStackTrace()
        }
    }

    private fun saveReminder() {
        val title = binding.titleInput.text.toString().trim()
        val latStr = binding.latInput.text.toString().trim()
        val lngStr = binding.lngInput.text.toString().trim()
        val radius = binding.radiusSeekBar.progress

        if (title.isEmpty() || latStr.isEmpty() || lngStr.isEmpty()) {
            Toast.makeText(this, "Please fill all fields", Toast.LENGTH_SHORT).show()
            return
        }

        val lat = latStr.toDoubleOrNull()
        val lng = lngStr.toDoubleOrNull()

        if (lat == null || lng == null) {
            Toast.makeText(this, "Invalid coordinates", Toast.LENGTH_SHORT).show()
            return
        }

        val request = ReminderRequest(title, lat, lng, radius)
        val apiService = RetrofitClient.getClient(sessionManager)

        binding.btnSave.isEnabled = false
        binding.btnSave.text = "Saving..."

        lifecycleScope.launch(Dispatchers.IO) {
            try {
                val response = apiService.createReminder(request)
                withContext(Dispatchers.Main) {
                    if (response.isSuccessful) {
                        Toast.makeText(this@AddReminderActivity, "Saved!", Toast.LENGTH_SHORT).show()
                        finish()
                    } else {
                        Toast.makeText(this@AddReminderActivity, "Failed to save", Toast.LENGTH_SHORT).show()
                        resetSaveButton()
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@AddReminderActivity, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
                    resetSaveButton()
                }
            }
        }
    }

    private fun resetSaveButton() {
        binding.btnSave.isEnabled = true
        binding.btnSave.text = "Save Reminder"
    }
}
