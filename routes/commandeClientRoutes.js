import express from 'express';
import commandeClientController from '../controller/commandeClientController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer();

router.post('/commande-clients', commandeClientController.createCommandeClient);
router.get('/commande-clients', commandeClientController.getAllCommandeClients);
router.post('/save-pdf', upload.single('pdfFile'), commandeClientController.savePDF);
router.get('/get-pdf/:factureId', commandeClientController.getPDF);

export default router;
