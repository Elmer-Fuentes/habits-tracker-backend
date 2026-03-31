const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Habit = require('../models/Habit');

// GET /api/habits - Obtener hábitos del usuario
router.get('/', auth, async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener hábitos' });
  }
});

// POST /api/habits - Crear hábito
router.post('/', auth, async (req, res) => {
  try {
    const { title, description } = req.body;
    const habit = new Habit({
      title,
      description: description || 'Meta diaria',
      user: req.user.id
    });
    await habit.save();
    res.json(habit);
  } catch (err) {
    res.status(500).json({ msg: 'Error al crear hábito' });
  }
});

// PUT /api/habits/:id/done - Marcar como completado (lógica de racha)
router.put('/:id/done', auth, async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user.id });
    if (!habit) return res.status(404).json({ msg: 'Hábito no encontrado' });

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // Idempotencia: no marcar dos veces el mismo día
    if (habit.lastCompletedAt) {
      const ultima = new Date(habit.lastCompletedAt);
      ultima.setHours(0, 0, 0, 0);
      if (hoy.getTime() === ultima.getTime()) {
        return res.status(400).json({ message: 'Habit already completed today' });
      }

      const diferenciaDias = (hoy - ultima) / (1000 * 60 * 60 * 24);
      if (diferenciaDias === 1) {
        habit.streak += 1; // Racha continúa
      } else {
        habit.streak = 1;  // Se reinicia
      }
    } else {
      habit.streak = 1; // Primera vez
    }

    habit.completedDays = (habit.completedDays || 0) + 1;
    habit.lastCompletedAt = hoy;
    await habit.save();

    res.json({
      message: 'Habit marked as done',
      streak: habit.streak,
      completedDays: habit.completedDays,
      habit
    });
  } catch (err) {
    res.status(500).json({ msg: 'Error al actualizar hábito' });
  }
});

// DELETE /api/habits/:id - Eliminar hábito
router.delete('/:id', auth, async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!habit) return res.status(404).json({ msg: 'No encontrado o no autorizado' });
    res.json({ message: 'Habit deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Error al eliminar hábito' });
  }
});

module.exports = router;