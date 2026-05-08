import React, { useState } from 'react';
import { deleteReminder } from '../services/api';
import { Trash2, MapPin, ToggleLeft, ToggleRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ReminderList = ({ reminders, onDelete }) => {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteReminder(id);
      onDelete(id);
    } catch (err) {
      console.error('Failed to delete:', err);
    } finally {
      setDeletingId(null);
    }
  };

  if (!reminders || reminders.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card"
        style={{ textAlign: 'center', padding: '3rem 1.5rem' }}
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ marginBottom: '1rem' }}
        >
          <MapPin size={52} color="rgba(139,92,246,0.3)" style={{ margin: '0 auto' }} />
        </motion.div>
        <h4 style={{ color: 'var(--text-muted)', fontWeight: '500' }}>No reminders yet</h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.35rem' }}>
          Create your first location reminder above.
        </p>
      </motion.div>
    );
  }

  return (
    <div>
      <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
        Active Reminders ({reminders.length})
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <AnimatePresence>
          {reminders.map((rem) => (
            <motion.div
              key={rem._id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50, height: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="card"
              style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                  background: 'linear-gradient(135deg, var(--primary-purple), #9333EA)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <MapPin size={18} color="white" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <h4 style={{ fontWeight: '600', color: 'var(--text-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {rem.title}
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    {rem.latitude.toFixed(4)}, {rem.longitude.toFixed(4)}
                    &nbsp;•&nbsp;
                    <span style={{ color: 'var(--secondary-orange)', fontWeight: '600' }}>{rem.radius}m</span>
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleDelete(rem._id)}
                disabled={deletingId === rem._id}
                className="btn"
                style={{
                  padding: '0.5rem', borderRadius: '8px',
                  background: '#FEE2E2', color: '#EF4444',
                  minWidth: 'auto', flexShrink: 0,
                  opacity: deletingId === rem._id ? 0.5 : 1
                }}
                title="Delete Reminder"
              >
                {deletingId === rem._id
                  ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Trash2 size={16} /></motion.div>
                  : <Trash2 size={16} />
                }
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ReminderList;
