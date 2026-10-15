const Customer = require('../models/customer.model');
const Product = require('../models/product.model');
const mongoose = require('mongoose');


// POST /wishlist/:productId - Add product to authenticated user's wishlist
exports.addToWishlist = async (req, res) =>{
  try{
    const{ productId } = req.params;
    const userId = req.user._id || req.user.id;
    

    if (!mongoose.Types.ObjectId.isValid(productId)){
      return res.status(400).json({ success: false, message: 'Invalid product ID format.' });
    }

    const productExists = await Product.findById(productId);
    if (!productExists){
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const user = await Customer.findById(userId);
    if (!user){
      return res.status(404).json({ success: false, message: 'User not found.' });
    }


    // Check for duplicate entry (409 Conflict)
    const isAlreadyInWishlist = user.wishlist.some(
      (id) => id.toString() === productId
    );

    if (isAlreadyInWishlist){
      return res.status(409).json({
        success: false,
        message: 'Product is already in your wishlist.',
      });
    }


    // Add to wishlist and save
    user.wishlist.push(productId);
    await user.save({ validateModifiedOnly: true });



    return res.status(200).json({
      success: true,
      message: 'Product added to wishlist.',
    });
  } catch (error){
    console.error('Error adding to wishlist:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

//GET /wishlist
exports.getWishlist = async (req, res) =>{
  try{
    const userId = req.user._id || req.user.id;

    const user = await Customer.findById(userId).populate({
      path: 'wishlist',
      select: 'name price category image stock',
    });

    if (!user){
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({
      success: true,
      count: user.wishlist.length,
      wishlist: user.wishlist,
    });
  } catch (error){
    console.error('Error fetching wishlist:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


// DELETE /wishlist/:productId
exports.removeFromWishlist = async (req, res) =>{
  try{
    const{ productId } = req.params;
    const userId = req.user._id || req.user.id;

    if (!mongoose.Types.ObjectId.isValid(productId)){
      return res.status(400).json({ success: false, message: 'Invalid product ID format.' });
    }

    const user = await Customer.findById(userId);
    if (!user){
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const existsInWishlist = user.wishlist.some(
      (id) => id.toString() === productId
    );

    if(!existsInWishlist){
      return res.status(404).json({
        success: false,
        message: 'Product not found in your wishlist.',
      });
    }

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId
    );

    await user.save({ validateModifiedOnly: true });

    return res.status(200).json({
      success: true,
      message: 'Product removed from wishlist.',
    });
  } 
  
  catch (error){
  
    console.error('Error removing from wishlist:', error);
    
    return res.status(500).json({ success: false, message: error.message });
  }
};