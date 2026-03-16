// ============================================================
// Archivo: app.js
// Descripción: Configuración principal del servidor Express.
//              Define middlewares, rutas y manejo de errores.
// Autor: Habits Tracker
// ============================================================

// #region Importaciones

require('./config/database'); // Conexión a MongoDB

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors'); // Permite peticiones desde el frontend (Next.js)

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// #endregion

// #region Inicialización de la aplicación

var app = express();

// #endregion

// #region Middlewares

// CORS debe configurarse antes de definir las rutas
app.use(cors());

// Motor de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middlewares estándar de Express
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// #endregion

// #region Rutas

app.use('/', indexRouter);       // Rutas de hábitos
app.use('/users', usersRouter);  // Rutas de usuarios

// #endregion

// #region Manejo de errores

// Captura rutas no encontradas y las convierte en error 404
app.use(function (req, res, next) {
  next(createError(404));
});

// Manejador global de errores
// En desarrollo muestra el detalle del error, en producción lo oculta
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

// #endregion

module.exports = app;