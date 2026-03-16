// ============================================================
// Archivo: index.js
// Descripción: Rutas principales de la API REST para hábitos.
//              Incluye lógica de racha de días (streak).
// Autor: Habits Tracker
// ============================================================

var express = require('express');
var router = express.Router();
const Habit = require('../models/Habit');

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
 * Verifica si una fecha fue ayer respecto a hoy.
 * Se usa para mantener la racha activa.
 * @param {Date} date - Fecha a verificar
 * @returns {boolean} true si la fecha es de ayer
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

// #region CRUD de Hábitos

// GET: Obtener todos los hábitos
router.get('/habits', async (req, res) => {
  try {
    const habits = await Habit.find();
    res.json(habits);
  } catch (err) {
    console.error('Error al obtener hábitos:', err);
    res.status(500).json({ message: 'Error retrieving habits', detail: err.message });
  }
});

// POST: Crear un nuevo hábito
router.post('/habits', async (req, res) => {
  try {
    const { title, description } = req.body;
    const habit = new Habit({ title, description });
    await habit.save();
    res.json(habit);
  } catch (err) {
    console.error('Error al crear hábito:', err);
    res.status(400).json({ message: 'Error creating habit', detail: err.message });
  }
});

// DELETE: Eliminar un hábito por ID
router.delete('/habits/:id', async (req, res) => {
  try {
    await Habit.findByIdAndDelete(req.params.id);
    res.json({ message: 'Habit deleted' });
  } catch (err) {
    console.error('Error al eliminar hábito:', err);
    res.status(500).json({ message: 'Habit not found', detail: err.message });
  }
});

// #endregion

// #region Lógica de racha (Streak / Done)

/**
 * PUT /habits/:id/done
 * Marca un hábito como completado hoy.
 * 
 * Reglas de racha:
 *  - Si ya fue marcado hoy → no hace nada (evita duplicados)
 *  - Si fue marcado ayer   → incrementa la racha (+1)
 *  - Si no fue marcado ayer → reinicia la racha a 1
 *  - completedDays siempre incrementa (total acumulado)
 */
router.put('/habits/:id/done', async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const now = new Date();

    // Evitar marcar dos veces el mismo día
    if (habit.lastCompletedAt && !isDifferentDay(habit.lastCompletedAt, now)) {
      return res.status(400).json({ message: 'Habit already completed today' });
    }

    // Calcular nueva racha
    if (habit.lastCompletedAt && isYesterday(habit.lastCompletedAt)) {
      // Fue completado ayer → continúa la racha
      habit.streak += 1;
    } else {
      // Se perdió la racha o es el primer día → reinicia a 1
      habit.streak = 1;
    }

    // Actualizar campos
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

// NOTA: Este export siempre debe ir al final del archivo
module.exports = router;