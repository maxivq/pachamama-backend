import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.js';

// Verificar si la clave de administrador es correcta
const verifyAdminAccess = async (req, res) => {
  try {
    const { secretKey } = req.body;
    
    // Verificar si la clave coincide con la almacenada en el servidor
    if (secretKey !== authConfig.secretKey) {
      return res.status(401).json({
        success: false,
        message: 'Clave de acceso incorrecta'
      });
    }
    
    // Generar token JWT
    const token = jwt.sign(
      { role: 'admin' },
      authConfig.jwtSecret,
      { expiresIn: authConfig.jwtExpiresIn }
    );
    
    res.status(200).json({
      success: true,
      token,
      message: 'Acceso concedido'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Verificar si un token JWT es válido
const verifyToken = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }
    
    try {
      // Verificar si el token es válido
      jwt.verify(token, authConfig.jwtSecret);
      
      res.status(200).json({
        success: true,
        message: 'Token válido'
      });
    } catch (error) {
      res.status(401).json({
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

export { verifyAdminAccess, verifyToken };