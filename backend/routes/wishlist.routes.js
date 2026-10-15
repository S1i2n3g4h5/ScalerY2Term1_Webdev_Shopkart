const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist.controller');
const {protect} = require('../middlewares/auth.middleware'); // Your existing Auth/JWT middleware from Lab-02

router.use(protect);

router.get('/', wishlistController.getWishlist);
router.post('/:productId', wishlistController.addToWishlist);
router.delete('/:productId', wishlistController.removeFromWishlist);

module.exports = router;