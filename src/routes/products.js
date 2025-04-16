import express from 'express';
import { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productController.js';
import { protectAdminRoute } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas públicas (GET)
router.route('/').get(getProducts);
router.route('/:id').get(getProduct);

// Rutas protegidas (POST, PUT, DELETE)
router.route('/').post(protectAdminRoute, createProduct);
router.route('/:id')
  .put(protectAdminRoute, updateProduct)
  .delete(protectAdminRoute, deleteProduct);

export default router;