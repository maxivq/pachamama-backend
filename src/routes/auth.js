import express from 'express';
import { verifyAdminAccess, verifyToken } from '../controllers/authController.js';

const router = express.Router();

router.post('/admin-access', verifyAdminAccess);
router.post('/verify-token', verifyToken);

export default router;