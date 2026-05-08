import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

// ── Auth ──────────────────────────────────────────────────────────────
export const registerUser = (username, password) =>
  axios.post(`${API_BASE}/auth/register`, { username, password });

export const loginUser = (username, password) =>
  axios.post(`${API_BASE}/auth/login`, { username, password });

// ── Reminders ─────────────────────────────────────────────────────────
export const fetchReminders = () =>
  axios.get(`${API_BASE}/reminders`, { headers: getAuthHeaders() });

export const createReminder = (data) =>
  axios.post(`${API_BASE}/reminders`, data, { headers: getAuthHeaders() });

export const deleteReminder = (id) =>
  axios.delete(`${API_BASE}/reminders/${id}`, { headers: getAuthHeaders() });
