const express = require('express');
const { getReminders, addReminder, deleteReminder } = require('../controllers/reminderController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', auth, getReminders);
router.post('/', auth, addReminder);
router.delete('/:id', auth, deleteReminder);

module.exports = router;
