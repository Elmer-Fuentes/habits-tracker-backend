// ============================================================
// Archivo: middleware/auth.js
// Descripción: Middleware de autorización (Requisito Punto 21).
//              Verifica el JWT enviado desde el frontend.
// ============================================================

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // 1. Obtener el token del header 'Authorization'
    // El frontend lo envía como: "Authorization: Bearer <token>"
    const authHeader = req.header('Authorization');
    
    // Verificación robusta del formato del header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            message: 'Acceso denegado. Formato de token inválido o no encontrado.' 
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 2. Validación de la clave secreta (Evita errores 500 silenciosos)
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('[AUTH ERROR]: JWT_SECRET no definido en el archivo .env');
            return res.status(500).json({ message: 'Error interno de configuración del servidor.' });
        }

        // 3. Verificar el token
        // Esto decodifica el { userId: user._id } que pusimos en routes/users.js
        const decoded = jwt.verify(token, secret);

        // 4. Inyectar los datos del usuario en la petición
        // Ahora req.user.userId estará disponible en todas las rutas de hábitos
        req.user = decoded;
        
        // 5. Dar paso al siguiente controlador
        next();
    } catch (error) {
        // Diferenciamos si el token expiró o si es basura
        const msg = error.name === 'TokenExpiredError' ? 'Sesión expirada.' : 'Token no válido.';
        res.status(401).json({ message: msg });
    }
};