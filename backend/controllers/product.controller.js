const Product = require('../models/product.model')

exports.createProduct = async (req, res) => {
    try{
        const {name, description, price, category, image,stock} = req.body;

        if(!name || !description || price ===undefined || !category || !image || stock ===undefined){
            return res.status(400).json({
                success:false,
                message:'All filed (name, description, price, category, image, stock) are required',
            });
        }

        const product = await Product.create({
            name, description, price, category, image, stock
        });

        return res.status(201).json({
            success:true,
            product
        });

    }catch(err){
        return res.status(400).json({
            success:false,
            message: err.message
        });
    }
};


// search and filtering
exports.getProducts = async (req, res) => {
    try{
        const {search, category, sort} = req.query;
        let query = {};

        // search filter
        if(search){
            query.name = { $regex: search, $options:'i'};
        }

        // category filter
        if(category){
            query.category = category;
        }


        // SORTING
        let sortoptions = {};
        if(sort === 'price_asc'){
            sortoptions.price = 1;
        }
        else if(sort === 'price_desc'){
            sortoptions.price = -1;
        }


        const products = await Product.find(query).select('name price category image stock').sort(sortoptions);

        return res.status(200).json({
            success:true,
            count: products.length,
            products
        });

    }catch(err){
        console.error('Error in getPorducts controller :', err);
        return res.status(500).json({
            success:false,
            message : err.message
        });
    }
}


exports.getProductById = async (req, res)  => {
    try{
        const {id } = req.params;
        const product = await Product.findById(id);

        if(!product){
            return res.status(404).json({
                success:false,
                message:  'Product not found'
            });
        }

        return res.status(200).json({
            success:true,
            product
        });
    }
    catch(err){
        return res.status(400).json({
            success:false,
            message: 'Invalid product ID format'
        });
    }

}