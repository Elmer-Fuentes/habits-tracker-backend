// Small test script to check MongoDB connection using backend .env
require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('No MONGO_URI found in .env');
  process.exit(1);
}

console.log('Testing MongoDB connection to:', uri);

// Short serverSelectionTimeoutMS to fail fast if network/DNS blocked
mongoose.connect(uri, { serverSelectionTimeoutMS: 7000 })
  .then(() => {
    console.log('✅ Connected to MongoDB (test script)');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error (test script):');
    console.error(err && err.stack ? err.stack : err);
  })
  .finally(() => {
    // Close connection and exit
    mongoose.disconnect()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  });
