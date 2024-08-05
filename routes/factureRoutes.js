// routes/factureRoutes.js
import express from 'express';
import factureController from '../controller/factureController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer();

// CRUD operations for Facture
router.post('/', factureController.createFacture);
// router.get('/:id', factureController.getFacture);
router.get('/', factureController.getAllFactures);
// router.put('/:id', factureController.updateFacture);
// router.delete('/:id', factureController.deleteFacture);
router.post('/:factureId/pdf', upload.single('pdfFile'), factureController.savePDF);

export default router;
