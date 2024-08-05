import express from 'express';
import userController from '../controller/userController.js'; // Ensure this path is correct
import authenticate from '../Middleware/authMiddleware.js'; // Middleware to authenticate JWT

const router = express.Router();

router.post('/login', userController.login);
router.post('/create', authenticate, userController.createUser);
router.get('/', authenticate, userController.getAllUsers);
router.get('/:id', authenticate, userController.getUserById);
router.put('/:id', authenticate, userController.updateUser);
router.delete('/:id', authenticate, userController.deleteUser);

export default router;
