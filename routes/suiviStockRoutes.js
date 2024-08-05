// routes/suiviStockRoutes.js
import express from 'express';
import suiviStockController from '../controller/suiviStockController.js';

const router = express.Router();

router.post('/', suiviStockController.addSuiviStock);
router.get('/', suiviStockController.getAllSuiviStocks);
// Add other routes as needed

export default router;
