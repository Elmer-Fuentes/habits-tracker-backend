// ============================================================
// Archivo: Habit.js
// Descripción: Modelo de datos para los hábitos del usuario.
//              Define la estructura del documento en MongoDB.
// Autor: Habits Tracker
// ============================================================

const mongoose = require('mongoose');

// #region Schema de Hábito
const habitSchema = new mongoose.Schema({

  // #region Campos básicos
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  // #endregion

  // #region Campos de racha y seguimiento
  streak: {
    type: Number,
    default: 0       // Días consecutivos completados
  },
  completedDays: {
    type: Number,
    default: 0       // Total de días completados acumulados
  },
  lastCompletedAt: {
    type: Date,
    default: null    // Última fecha en que se marcó como completado
  },
  // #endregion

  // #region Campos de auditoría
  createdAt: {
    type: Date,
    default: Date.now
  }
  // #endregion

});
// #endregion

module.exports = mongoose.model('Habit', habitSchema);