import dotenv from 'dotenv';

dotenv.config();

export default {
  secretKey: process.env.ADMIN_SECRET_KEY,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: '7d' // Tokens válidos por 7 días
};