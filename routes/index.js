var express = require('express');
var router = express.Router();
const Habit = require('../models/Habit');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// GET: Obtener todos los hábitos
router.get('/habits', async (req, res) => {
  try {
    const habits = await Habit.find();
    res.json(habits);
  } catch (err) {
    // IMPORTANTE: Esto imprimirá el error real en tu terminal de VS Code
    console.error("DETALLE DEL ERROR:", err); 
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
    res.status(400).json({ message: 'Error creating habit' });
  }
});

// DELETE: Eliminar un hábito
router.delete('/habits/:id', async (req, res) => {
  try {
    await Habit.findByIdAndDelete(req.params.id);
    res.json({ message: 'Habit deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Habit not found' });
  }
});

// ESTO SIEMPRE DEBE IR AL FINAL DEL ARCHIVO
module.exports = router;