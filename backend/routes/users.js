// ============================================================
// Archivo: users.js
// Descripción: Rutas de autenticación de usuarios.
//              Incluye registro con hash bcrypt y login con JWT.
// ============================================================

//#region 1. IMPORTACIONES
const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
//#endregion

//#region 2. REGISTRO DE USUARIO

/**
 * POST /users/register
 * Crea un nuevo usuario con la contraseña hasheada.
 * El hash se aplica automáticamente en el modelo User.js (pre-save hook).
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar que se enviaron los campos requeridos
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    // Verificar si el usuario ya existe en MongoDB
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Crear y guardar el nuevo usuario
    // NOTA: El hash de la contraseña se aplica en el modelo (pre-save)
    const user = new User({ email, password });
    await user.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente' });

  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ message: 'Error en el servidor al registrar' });
  }
});

//#endregion

//#region 3. LOGIN DE USUARIO

/**
 * POST /users/login
 * Verifica credenciales y retorna un token JWT si son válidas.
 * El token tiene expiración de 24 horas.
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar que se enviaron los campos requeridos
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    // Buscar el usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Comparar la contraseña ingresada con el hash almacenado en MongoDB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Generar token JWT
    // IMPORTANTE: JWT_SECRET debe estar definido en el archivo .env
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback_secret_dev',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      message: 'Login exitoso',
      userId: user._id
    });

  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ message: 'Error en el servidor al iniciar sesión' });
  }
});

//#endregion

module.exports = router;