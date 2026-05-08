const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    radius: { type: Number, required: true }, // meters
    isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Reminder', ReminderSchema);
