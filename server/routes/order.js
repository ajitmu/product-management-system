import express from 'express';
import authMiddleware from '../middleware/authMidlleware.js';
import { addOrder,getOrders } from '../controllers/orderController.js';

const router = express.Router();



router.post('/add', authMiddleware,addOrder);
router.get('/', authMiddleware,getOrders);



export default router;  
