// routes/commandeClientRoutes.js
import express from 'express';
import commandeClientController from '../controller/commandeClientController.js';

const router = express.Router();

// CRUD operations for Commande Client
router.post('/', commandeClientController.createCommandeClient);
// router.get('/:id', commandeClientController.getCommandeClient);
router.get('/', commandeClientController.getAllCommandeClients);
// router.put('/:id', commandeClientController.updateCommandeClient);
// router.delete('/:id', commandeClientController.deleteCommandeClient);

export default router;
