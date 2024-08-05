// routes/categoryRoutes.js
import express from 'express';
import categoryController from '../controller/categoryController.js';

const router = express.Router();

router.post('/addcategory', categoryController.addCategory);
router.get('/getcategory', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

export default router;
