// routes/orderRoutes.js
import express from 'express';
import orderController from '../controller/orderController.js';

const router = express.Router();

// Define routes for Order
router.post('/', orderController.createOrder);
// router.get('/:id', orderController.getOrder);
router.get('/', orderController.getAllOrders);
// router.put('/:id', orderController.updateOrder);
// router.delete('/:id', orderController.deleteOrder);

export default router;
