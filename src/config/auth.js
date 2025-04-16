import dotenv from 'dotenv';

dotenv.config();

export default {
  secretKey: process.env.ADMIN_SECRET_KEY || 'pachamama-admin-default-key',
  jwtSecret: process.env.JWT_SECRET || 'pachamama-jwt-secret',
  jwtExpiresIn: '7d' // Tokens válidos por 7 días
};