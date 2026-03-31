const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  streak: { type: Number, default: 0 },
  completedDays: { type: Number, default: 0 }, // ← AGREGADO
  lastCompletedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Habit', habitSchema);