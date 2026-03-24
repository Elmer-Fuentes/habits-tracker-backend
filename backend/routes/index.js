// ============================================================
// Archivo: index.js
// Descripción: Rutas principales de la API REST para hábitos.
//              Incluye lógica de racha de días (streak).
//              Actualizado: Protección con JWT y reinicio de racha (Semana 5).
// Autor: Habits Tracker
// ============================================================

var express = require('express');
var router = express.Router();
const Habit = require('../models/Habit');
const auth = require('../middleware/auth'); // Requisito Punto 21: Identificación y Autorización

// #region Utilidades internas

/**
 * Verifica si dos fechas corresponden a días distintos.
 * @param {Date} date1 - Primera fecha
 * @param {Date} date2 - Segunda fecha
 * @returns {boolean} true si son días diferentes
 */
function isDifferentDay(date1, date2) {
  const d1 = new Date(date1).setHours(0, 0, 0, 0);
  const d2 = new Date(date2).setHours(0, 0, 0, 0);
  return d1 !== d2;
}

/**
 * Verifica si una fecha fue exactamente ayer respecto a hoy.
 * Se usa para mantener la racha activa según el método de 66 días.
 * @param {Date} date - Fecha a verificar
 * @returns {boolean} true si la fecha fue ayer
 */
function isYesterday(date) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  const d = new Date(date).setHours(0, 0, 0, 0);
  return d === yesterday.getTime();
}

// #endregion

// #region Ruta de vista principal (Express default)

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// #endregion

// #region CRUD de Hábitos (Protegidos con Middleware auth - Punto 21)

// GET: Obtener solo los hábitos del usuario autenticado
router.get('/habits', auth, async (req, res) => {
  try {
    // Solo devolvemos los hábitos que pertenecen al usuario del token
    const habits = await Habit.find({ user: req.user.userId });
    res.json(habits);
  } catch (err) {
    console.error('Error al obtener hábitos:', err);
    res.status(500).json({ message: 'Error retrieving habits', detail: err.message });
  }
});

// POST: Crear un nuevo hábito vinculado al usuario actual (Punto 24)
router.post('/habits', auth, async (req, res) => {
  try {
    const { title, description } = req.body;
    
    // Vinculación automática: se asigna el userId del middleware auth
    const habit = new Habit({ 
      title, 
      description,
      user: req.user.userId 
    });

    await habit.save();
    res.json(habit);
  } catch (err) {
    console.error('Error al crear hábito:', err);
    res.status(400).json({ message: 'Error creating habit', detail: err.message });
  }
});

// DELETE: Eliminar un hábito (Verificando propiedad para seguridad)
router.delete('/habits/:id', auth, async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user.userId 
    });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found or unauthorized' });
    }

    res.json({ message: 'Habit deleted' });
  } catch (err) {
    console.error('Error al eliminar hábito:', err);
    res.status(500).json({ message: 'Error deleting habit', detail: err.message });
  }
});

// #endregion

// #region Lógica de racha y completado (Punto 18)

/**
 * PUT /habits/:id/done
 * Marca un hábito como completado hoy y gestiona la racha.
 */
router.put('/habits/:id/done', auth, async (req, res) => {
  try {
    const habit = await Habit.findOne({ 
      _id: req.params.id, 
      user: req.user.userId 
    });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found or unauthorized' });
    }

    const now = new Date();

    // 1. Evitar marcar dos veces el mismo día (Idempotencia)
    if (habit.lastCompletedAt && !isDifferentDay(habit.lastCompletedAt, now)) {
      return res.status(400).json({ message: 'Habit already completed today' });
    }

    // 2. Lógica de racha activa vs reinicio (Requisito Punto 18)
    if (habit.lastCompletedAt && isYesterday(habit.lastCompletedAt)) {
      // Si se completó ayer, la racha continúa
      habit.streak += 1;
    } else {
      // Si NO se marcó ayer, el conteo se reinicia a 1 (Punto 18)
      habit.streak = 1;
    }

    // 3. Actualizar campos de seguimiento
    habit.completedDays += 1;
    habit.lastCompletedAt = now;

    await habit.save();

    res.json({
      message: 'Habit marked as done',
      streak: habit.streak,
      completedDays: habit.completedDays,
      habit
    });

  } catch (err) {
    console.error('Error al marcar hábito como completado:', err);
    res.status(500).json({ message: 'Error updating habit', detail: err.message });
  }
});

// #endregion

module.exports = router;