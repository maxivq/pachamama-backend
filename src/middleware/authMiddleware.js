import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.js';

const protectAdminRoute = (req, res, next) => {
  try {
    // Obtener token del encabezado Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Acceso no autorizado. Token no proporcionado'
      });
    }
    
    // Extraer el token del encabezado
    const token = authHeader.split(' ')[1];
    
    try {
      // Verificar el token
      const decoded = jwt.verify(token, authConfig.jwtSecret);
      
      // Verificar si el usuario tiene rol de administrador
      if (decoded.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Permisos insuficientes'
        });
      }
      
      // Adjuntar información del usuario a la solicitud
      req.user = decoded;
      next();
      
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

export { protectAdminRoute };