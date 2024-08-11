import express from 'express';
import userController from '../controller/userController.js'; // Ensure this path is correct
import authenticate from '../Middleware/authMiddleware.js'; // Middleware to authenticate JWT
import multer from 'multer';


const router = express.Router();
const upload = multer({ dest: 'uploads/profile-images/' });

router.post('/login', userController.login);
router.post('/create', authenticate, upload.single('profileImage'), userController.createUser);
router.get('/', userController.getAllUsers);
router.patch('/block/:id', userController.blockUser);

router.get('/:id', authenticate, userController.getUserById);
router.put('/:id', authenticate, userController.updateUser);
router.delete('/:id', authenticate, userController.deleteUser);

export default router;
