// routes/fournisseurRoutes.js
import express from 'express';
import fournisseurController from '../controller/fournisseurController.js';

const router = express.Router();

router.post('/addfournisseur', fournisseurController.addFournisseur);
router.get('/getfournisseur', fournisseurController.getAllFournisseurs);
router.get('/getfournisseur/:id', fournisseurController.getFournisseurById);
router.put('/fournisseurs/:id', fournisseurController.updateFournisseur);
router.delete('/fournisseurs/:id', fournisseurController.deleteFournisseur);

export default router;
