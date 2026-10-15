const jwt =require('jsonwebtoken');
const Customer = require('../models/customer.model');

const protect = async (req, res, next)=>{
    let token;

    // reading incoming token
    if(req.cookies && req.cookies.jwt){
        token = req.cookies.jwt;
    }


    // rejct if no token
    if(!token){
        return res.status(401).json({
            success: false,
            message : "Not authorized, no token provided"
        });
    }


    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await Customer.findById(decoded.id).select("-password");

        if(!req.user){
            return res.status(401).json({
                success:false,
                message : 'User no longer exists'
            });
        }


        // proceeding to next controller
        next();

    }
    catch(err){
        return res.status(401).json({
            success : false,
            message : 'Not authorized, token failed or expired'
        });
    }

}


module.exports = {protect};