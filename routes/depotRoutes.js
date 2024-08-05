import express from 'express';
import depotController from '../controller/depotController.js';

const router = express.Router();

// CRUD operations for Depot
router.post('/', depotController.addDepot);
router.get('/:id', depotController.getDepotById);
router.get('/', depotController.getAllDepots);
router.put('/:id', depotController.updateDepot);
router.delete('/:id', depotController.deleteDepot);

export default router;
