const mongoose = require('mongoose');

// In-memory store fallback when no real MongoDB is configured
let usingMemory = false;
const memoryStore = { users: [], reminders: [] };

const connectDB = async () => {
  const uri = process.env.MONGO_URI || '';
  const isPlaceholder = !uri || uri.includes('fake') || uri.includes('test:test');

  if (isPlaceholder) {
    console.log('⚠️  No valid MONGO_URI found — using in-memory store (data resets on restart).');
    usingMemory = true;
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.log('⚠️  Falling back to in-memory store.');
    usingMemory = true;
  }
};

module.exports = { connectDB, memoryStore, isMemory: () => usingMemory };
