const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ msg: 'No hay token, permiso denegado' });

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = decoded.user; // => req.user.id
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token no válido' });
  }
};