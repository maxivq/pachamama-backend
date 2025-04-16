import express from 'express';
import { getCart, addToCart, removeFromCart, clearCart, checkoutToWhatsApp } from '../controllers/cartController.js';

const router = express.Router();

router.get('/:sessionId', getCart);
router.post('/add', addToCart);
router.post('/remove', removeFromCart);
router.post('/clear', clearCart);
router.post('/checkout', checkoutToWhatsApp);

export default router;