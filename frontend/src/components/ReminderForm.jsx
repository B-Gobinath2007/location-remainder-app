import React, { useState } from 'react';
import { createReminder } from '../services/api';
import { Plus, MapPin, Crosshair, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ReminderForm = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [radius, setRadius] = useState(500);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);

  const fillCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(String(pos.coords.latitude.toFixed(6)));
        setLng(String(pos.coords.longitude.toFixed(6)));
        setGpsLoading(false);
        setError('');
      },
      () => {
        setError('Could not get GPS position. Please enter coordinates manually.');
        setGpsLoading(false);
      },
      { timeout: 10000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);

    if (!title.trim()) { setError('Please enter a reminder title.'); return; }
    if (isNaN(parsedLat) || lat === '') { setError('Please enter a valid latitude (e.g. 13.0827).'); return; }
    if (isNaN(parsedLng) || lng === '') { setError('Please enter a valid longitude (e.g. 80.2707).'); return; }

    setLoading(true);
    try {
      const res = await createReminder({
        title: title.trim(),
        latitude: parsedLat,
        longitude: parsedLng,
        radius: Number(radius),
      });
      onAdd(res.data);
      setTitle('');
      setLat('');
      setLng('');
      setRadius(500);
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Failed to create reminder.';
      setError(`Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
      style={{ marginBottom: '1.5rem' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
        <div style={{
          width: 36, height: 36, borderRadius: '10px',
          background: 'linear-gradient(135deg, var(--primary-purple), #9333EA)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <MapPin size={18} color="white" />
        </div>
        <h3 style={{ color: 'var(--text-dark)', fontWeight: '700', fontSize: '1.05rem' }}>
          Create Reminder
        </h3>
      </div>

      {/* Error Banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: '#FEF2F2', color: '#B91C1C', border: '1px solid #FECACA',
              padding: '0.75rem 1rem', borderRadius: '8px',
              marginBottom: '1rem', fontSize: '0.85rem',
              display: 'flex', gap: '0.5rem', alignItems: 'flex-start'
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <label style={labelStyle}>Reminder Title</label>
        <input
          type="text"
          placeholder="e.g. Buy groceries at this store"
          className="input-field"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Coordinates Row */}
        <label style={labelStyle}>Coordinates</label>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Latitude"
            className="input-field"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            style={{ flex: 1, marginBottom: 0 }}
          />
          <input
            type="text"
            placeholder="Longitude"
            className="input-field"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            style={{ flex: 1, marginBottom: 0 }}
          />
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={fillCurrentLocation}
            title="Use my current GPS location"
            className="btn"
            style={{
              padding: '0.55rem 0.7rem', minWidth: 'auto',
              background: gpsLoading ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.1)',
              color: 'var(--primary-purple)', borderRadius: '10px', flexShrink: 0
            }}
          >
            <motion.div
              animate={gpsLoading ? { rotate: 360 } : { rotate: 0 }}
              transition={{ repeat: gpsLoading ? Infinity : 0, duration: 1, ease: 'linear' }}
            >
              <Crosshair size={18} />
            </motion.div>
          </motion.button>
        </div>

        {/* Radius Slider */}
        <label style={labelStyle}>
          Trigger Radius:{' '}
          <span style={{ color: 'var(--primary-purple)', fontWeight: 700 }}>
            {radius >= 1000 ? `${(radius / 1000).toFixed(1)}km` : `${radius}m`}
          </span>
        </label>
        <input
          type="range" min="50" max="5000" step="50"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--primary-purple)', cursor: 'pointer', marginBottom: '0.35rem' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          <span>50m</span><span>5km</span>
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className="btn btn-primary"
          style={{ width: '100%', gap: '0.5rem', opacity: loading ? 0.75 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          disabled={loading}
        >
          {loading ? (
            <>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                <Plus size={18} />
              </motion.div>
              Saving…
            </>
          ) : (
            <><Plus size={18} /> Add Reminder</>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

const labelStyle = {
  display: 'block',
  fontSize: '0.8rem',
  fontWeight: '600',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  marginBottom: '0.4rem'
};

export default ReminderForm;
