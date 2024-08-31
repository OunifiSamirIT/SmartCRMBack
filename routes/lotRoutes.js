import express from 'express';
import lotController from '../controller/lotController.js';

const router = express.Router();

// CRUD operations for Lot
router.post('/', lotController.addLot);
router.get('/:id', lotController.getLot);
router.get('/', lotController.getAllLots);
router.get('/stocks/lot/:lotId', lotController.verifiequantityLot);
router.put('/:id', lotController.updateLot);
router.delete('/:id', lotController.deleteLot);

export default router;
