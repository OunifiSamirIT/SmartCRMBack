import express from 'express';
import roleController from '../controller/roleController.js'; // Ensure this path is correct
import authenticate from '../Middleware/authMiddleware.js'; // Middleware to authenticate JWT

const router = express.Router();

router.post('/create', authenticate, roleController.addRole);
router.get('/', authenticate, roleController.getAllRoles);

export default router;
