const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { memoryStore, isMemory } = require('../config/db');

// ── Mongoose helper (real DB mode) ────────────────────────────────────
const User = require('../models/User');

// ── Register ──────────────────────────────────────────────────────────
exports.register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Username and password are required.' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    if (isMemory()) {
      const exists = memoryStore.users.find(u => u.username === username);
      if (exists) return res.status(400).json({ error: 'Username already taken.' });
      const id = `user_${Date.now()}`;
      memoryStore.users.push({ _id: id, username, password: hashedPassword });
      return res.status(201).json({ message: 'User registered successfully.' });
    }

    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    res.status(400).json({ error: 'Registration failed.' });
  }
};

// ── Login ─────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Username and password are required.' });

  try {
    let user;

    if (isMemory()) {
      user = memoryStore.users.find(u => u.username === username);
      if (!user) return res.status(400).json({ error: 'User not found.' });
    } else {
      user = await User.findOne({ username });
      if (!user) return res.status(400).json({ error: 'User not found.' });
    }

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ error: 'Invalid password.' });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
