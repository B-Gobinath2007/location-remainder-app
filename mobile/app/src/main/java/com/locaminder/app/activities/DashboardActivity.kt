package com.locaminder.app.activities

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.OnMapReadyCallback
import com.google.android.gms.maps.SupportMapFragment
import com.google.android.gms.maps.model.CircleOptions
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.MarkerOptions
import com.locaminder.app.R
import com.locaminder.app.adapters.ReminderAdapter
import com.locaminder.app.databinding.ActivityDashboardBinding
import com.locaminder.app.models.Reminder
import com.locaminder.app.network.RetrofitClient
import com.locaminder.app.network.SessionManager
import com.locaminder.app.services.LocationForegroundService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class DashboardActivity : AppCompatActivity(), OnMapReadyCallback {

    private lateinit var binding: ActivityDashboardBinding
    private lateinit var sessionManager: SessionManager
    private lateinit var adapter: ReminderAdapter
    private var remindersList = mutableListOf<Reminder>()
    private var googleMap: GoogleMap? = null

    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        if (permissions[Manifest.permission.ACCESS_FINE_LOCATION] == true) {
            setupMapAndLocation()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityDashboardBinding.inflate(layoutInflater)
        setContentView(binding.root)

        sessionManager = SessionManager(this)

        setupToolbar()
        setupRecyclerView()
        setupListeners()

        val mapFragment = supportFragmentManager.findFragmentById(R.id.mapFragment) as SupportMapFragment
        mapFragment.getMapAsync(this)

        checkPermissionsAndStart()
    }

    override fun onResume() {
        super.onResume()
        fetchReminders()
    }

    private fun setupToolbar() {
        binding.toolbar.inflateMenu(R.menu.menu_dashboard)
        binding.toolbar.setOnMenuItemClickListener { item ->
            when (item.itemId) {
                R.id.action_logout -> {
                    sessionManager.clearSession()
                    startActivity(Intent(this, LoginActivity::class.java))
                    finish()
                    true
                }
                else -> false
            }
        }
    }

    private fun setupRecyclerView() {
        adapter = ReminderAdapter(remindersList) { id, _ -> deleteReminder(id) }
        binding.recyclerView.layoutManager = LinearLayoutManager(this)
        binding.recyclerView.adapter = adapter
    }

    private fun setupListeners() {
        binding.fabAdd.setOnClickListener {
            startActivity(Intent(this, AddReminderActivity::class.java))
        }

        binding.swipeRefresh.setOnRefreshListener {
            fetchReminders()
        }
    }

    private fun checkPermissionsAndStart() {
        val permissions = mutableListOf(
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION
        )
        
        if (Build.VERSION.SDK_INT >= Build.VERSION.SDK_INT) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                permissions.add(Manifest.permission.POST_NOTIFICATIONS)
            }
        }

        val missingPermissions = permissions.filter {
            ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED
        }

        if (missingPermissions.isEmpty()) {
            setupMapAndLocation()
        } else {
            requestPermissionLauncher.launch(missingPermissions.toTypedArray())
        }
    }

    private fun setupMapAndLocation() {
        // Start foreground service for location tracking
        val serviceIntent = Intent(this, LocationForegroundService::class.java)
        ContextCompat.startForegroundService(this, serviceIntent)
    }

    override fun onMapReady(map: GoogleMap) {
        googleMap = map
        updateMapMarkers()
    }

    private fun fetchReminders() {
        binding.swipeRefresh.isRefreshing = true
        val apiService = RetrofitClient.getClient(sessionManager)

        lifecycleScope.launch(Dispatchers.IO) {
            try {
                val response = apiService.getReminders()
                withContext(Dispatchers.Main) {
                    binding.swipeRefresh.isRefreshing = false
                    if (response.isSuccessful && response.body() != null) {
                        remindersList.clear()
                        remindersList.addAll(response.body()!!)
                        adapter.updateData(remindersList)
                        updateUI()
                        updateMapMarkers()
                        
                        // Start tracking geofences (simulated by syncing to service or GeofencingApi)
                        LocationForegroundService.syncGeofences(this@DashboardActivity, remindersList)
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    binding.swipeRefresh.isRefreshing = false
                    Toast.makeText(this@DashboardActivity, "Error fetching data", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    private fun deleteReminder(id: String) {
        val apiService = RetrofitClient.getClient(sessionManager)
        lifecycleScope.launch(Dispatchers.IO) {
            try {
                val response = apiService.deleteReminder(id)
                withContext(Dispatchers.Main) {
                    if (response.isSuccessful) {
                        remindersList.removeAll { it._id == id }
                        adapter.updateData(remindersList)
                        updateUI()
                        updateMapMarkers()
                    } else {
                        Toast.makeText(this@DashboardActivity, "Failed to delete", Toast.LENGTH_SHORT).show()
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@DashboardActivity, "Error deleting", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    private fun updateUI() {
        if (remindersList.isEmpty()) {
            binding.emptyText.visibility = View.VISIBLE
            binding.recyclerView.visibility = View.GONE
        } else {
            binding.emptyText.visibility = View.GONE
            binding.recyclerView.visibility = View.VISIBLE
        }
    }

    private fun updateMapMarkers() {
        googleMap?.let { map ->
            map.clear()
            
            if (remindersList.isNotEmpty()) {
                val first = remindersList.first()
                map.moveCamera(CameraUpdateFactory.newLatLngZoom(LatLng(first.latitude, first.longitude), 12f))
            } else {
                map.moveCamera(CameraUpdateFactory.newLatLngZoom(LatLng(51.505, -0.09), 10f))
            }

            remindersList.forEach { rem ->
                val latLng = LatLng(rem.latitude, rem.longitude)
                map.addMarker(MarkerOptions().position(latLng).title(rem.title))
                
                // Draw radius circle
                map.addCircle(
                    CircleOptions()
                        .center(latLng)
                        .radius(rem.radius.toDouble())
                        .strokeColor(ContextCompat.getColor(this, R.color.primary_purple))
                        .fillColor(0x338B5CF6) // 20% opacity primary_purple
                        .strokeWidth(2f)
                )
            }
        }
    }
}
