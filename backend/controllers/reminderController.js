const { memoryStore, isMemory } = require('../config/db');
const Reminder = require('../models/Reminder');

// ── Get All ───────────────────────────────────────────────────────────
exports.getReminders = async (req, res) => {
  try {
    if (isMemory()) {
      const reminders = memoryStore.reminders.filter(r => r.userId === req.user._id);
      return res.json(reminders);
    }
    const reminders = await Reminder.find({ userId: req.user._id });
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── Create ────────────────────────────────────────────────────────────
exports.addReminder = async (req, res) => {
  const { title, latitude, longitude, radius } = req.body;
  if (!title || latitude == null || longitude == null)
    return res.status(400).json({ error: 'title, latitude, and longitude are required.' });

  try {
    if (isMemory()) {
      const newReminder = {
        _id: `rem_${Date.now()}`,
        userId: req.user._id,
        title,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        radius: parseInt(radius, 10) || 500,
        isActive: true
      };
      memoryStore.reminders.push(newReminder);
      return res.status(201).json(newReminder);
    }

    const reminder = new Reminder({ userId: req.user._id, title, latitude, longitude, radius: radius || 500 });
    const saved = await reminder.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ── Delete ────────────────────────────────────────────────────────────
exports.deleteReminder = async (req, res) => {
  try {
    if (isMemory()) {
      const idx = memoryStore.reminders.findIndex(r => r._id === req.params.id);
      if (idx === -1) return res.status(404).json({ error: 'Reminder not found.' });
      memoryStore.reminders.splice(idx, 1);
      return res.json({ message: 'Deleted.' });
    }
    await Reminder.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
