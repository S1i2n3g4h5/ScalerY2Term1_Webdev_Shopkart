const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { protect } = require('../middlewares/auth.middleware');

// Protect all cart endpoints
router.use(protect);

router.get('/', cartController.getCart);
router.post('/:productId', cartController.addToCart);
router.patch('/:productId', cartController.updateQuantity);
router.delete('/:productId', cartController.removeFromCart);

module.exports = router;