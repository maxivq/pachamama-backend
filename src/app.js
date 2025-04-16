import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';
import { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from './controllers/productController.js';
import cartRoutes from './routes/cart.js';
import authRoutes from './routes/auth.js';
import { protectAdminRoute } from './middleware/authMiddleware.js';

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas públicas
app.use('/api/cart', cartRoutes);
app.use('/api/auth', authRoutes);

// Rutas de productos - Explícitamente separadas
// Rutas públicas GET
app.get('/api/products', getProducts);
app.get('/api/products/:id', getProduct);

// Rutas protegidas con middleware
app.post('/api/products', protectAdminRoute, createProduct);
app.put('/api/products/:id', protectAdminRoute, updateProduct);
app.delete('/api/products/:id', protectAdminRoute, deleteProduct);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});