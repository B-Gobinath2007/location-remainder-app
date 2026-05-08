import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import ReminderForm from '../components/ReminderForm';
import ReminderList from '../components/ReminderList';
import MapView from '../components/MapView';
import useLocation from '../hooks/useLocation';
import { getDistance } from '../utils/distance';
import { fetchReminders } from '../services/api';
import { motion } from 'framer-motion';
import { Bell, MapPin, Wifi, WifiOff } from 'lucide-react';

const Dashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const [reminders, setReminders] = useState([]);
  const { location, error: gpsError } = useLocation();
  const [nearbyReminders, setNearbyReminders] = useState([]);

  // Fetch reminders on mount
  useEffect(() => {
    if (!user?.token) return;
    fetchReminders()
      .then(res => setReminders(res.data))
      .catch(err => console.error('Failed to fetch reminders:', err));
  }, [user]);

  // Request browser notification permission once
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Check proximity whenever GPS or reminders change
  useEffect(() => {
    if (!location || reminders.length === 0) return;
    const triggered = reminders.filter(rem => {
      const dist = getDistance(location.lat, location.lng, rem.latitude, rem.longitude);
      return dist <= rem.radius;
    });

    setNearbyReminders(triggered);

    if (triggered.length > 0 && 'Notification' in window && Notification.permission === 'granted') {
      triggered.forEach(t => {
        new Notification('📍 LocaMinder Alert!', { body: t.title, icon: '/vite.svg' });
      });
    }
  }, [location, reminders]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
          <MapPin size={48} color="var(--primary-purple)" />
        </motion.div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="main-content">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-dark)' }}>Your Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {reminders.length} active reminder{reminders.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* GPS Status Pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: location ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
          color: location ? '#16A34A' : '#DC2626',
          border: `1px solid ${location ? '#86EFAC' : '#FCA5A5'}`,
          padding: '0.5rem 1rem', borderRadius: '50px', fontSize: '0.875rem', fontWeight: '600'
        }}>
          {location ? <Wifi size={16} /> : <WifiOff size={16} />}
          {location ? `GPS Active — ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : gpsError || 'GPS Unavailable'}
        </div>
      </div>

      {/* Nearby Alert Banner */}
      {nearbyReminders.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, #FEF3C7, #FFF7ED)',
            borderLeft: '4px solid var(--secondary-orange)',
            padding: '1.25rem 1.5rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            display: 'flex', gap: '1rem', alignItems: 'flex-start'
          }}
        >
          <motion.div animate={{ rotate: [0, -15, 15, 0] }} transition={{ repeat: Infinity, duration: 0.8 }}>
            <Bell size={24} color="var(--secondary-orange)" />
          </motion.div>
          <div>
            <h3 style={{ color: '#92400E', fontWeight: '700', marginBottom: '0.4rem' }}>
              You're inside a reminder zone!
            </h3>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {nearbyReminders.map(nr => (
                <li key={nr._id} style={{ color: '#B45309', marginTop: '0.2rem' }}>
                  📌 {nr.title} ({nr.radius}m radius)
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Left: Form + List */}
        <div>
          <ReminderForm onAdd={(rem) => setReminders(prev => [...prev, rem])} />
          <ReminderList
            reminders={reminders}
            onDelete={(id) => setReminders(prev => prev.filter(r => r._id !== id))}
          />
        </div>

        {/* Right: Map */}
        <div>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ color: 'var(--primary-purple)', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '600' }}>
              🗺️ Live Map
            </h3>
            <MapView reminders={reminders} userLocation={location} />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem', textAlign: 'center' }}>
              Purple circles show your geofenced reminder zones
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
