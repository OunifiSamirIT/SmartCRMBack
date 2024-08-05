// routes/stockRoutes.js
import express from 'express';
import stockController from '../controller/stockController.js';

const router = express.Router();

router.post('/', stockController.addStock);
router.get('/', stockController.getAllStocks);
router.get('/:id', stockController.getStock);
router.put('/:id', stockController.updateStock);
router.delete('/:id', stockController.deleteStock);
router.get('/:id/products', stockController.getProductsByStock);

export default router;