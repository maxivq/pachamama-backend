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

// Rutas públicas
router.route('/').get(getProducts);
// Eliminamos esta ruta problemática:
// router.route('/categories').get(getCategories);
router.route('/:id').get(getProduct);

// Rutas protegidas
router.route('/').post(protectAdminRoute, createProduct);
router.route('/:id')
  .put(protectAdminRoute, updateProduct)
  .delete(protectAdminRoute, deleteProduct);

export default router;