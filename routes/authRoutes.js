// routes/authRoutes.js
import express from 'express';
import authController from '../controller/authController.js';

const router = express.Router();

router.post('/login', authController.login);

export default router;
