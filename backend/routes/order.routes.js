const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);

router.post('/create-payment-order', orderController.createPaymentOrder);
router.post('/verify-payment', orderController.verifyPayment);
router.get('/', orderController.getUserOrders);
router.get('/:id', orderController.getOrderById);

module.exports = router;