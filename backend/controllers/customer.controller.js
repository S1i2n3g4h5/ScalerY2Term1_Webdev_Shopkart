const CustomerModel = require('../models/customer.model');
const bcrypt= require('bcryptjs');
const generateToken = require('../utils/generateToken');


const registerCustomer= async (req, res) =>{
    try{
        const {fullName, email, password, phone} = req.body;

        if(!fullName || !email || !password || !phone){
            return res.status(400).json({
                success : false,
                message :'All fileds are required [fullName, email, password, phone] '
            });
        }


        if(password.length < 6){
            return res.status(400).json({
                success : false,
                message : 'Password must contain at least 6 chars'
            });
        }

        const existingCustomer = await CustomerModel.findOne({email});
        if(existingCustomer){
            return res.status(409).json({
                success:false,
                message : 'Email already exists'
            });
        }



        // New document
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const customer = await CustomerModel.create({
            fullName, email, password : hashedPassword,
            phone
        });


        return res.status(201).json({
            success : true,
            message : 'Cusotmer registered successfully',
            customer,
        });
    
    }
    catch (err){
        return res.status(500).json({
            success : false, 
            message : "Server Error",
            error : err.message
        });
    }
};



const loginCustomer = async (req, res)=>{
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success : false,
                message : 'Please provide both email and password'
            });
        }

        
        const customer = await CustomerModel.findOne({email});
        if(!customer){
            return res.status(401).json({
                status : false,
                message : 'Invalid credentails'
            });
        }


        const passwordMatch = await bcrypt.compare(password, customer.password);
        if(!passwordMatch){
            return res.status(401).json({
                success : false,
                message : 'Invalid credentials'
            });
        }


        // JWT toke  and attaching to https only cookie
        generateToken(res, customer._id);


        return res.status(200).json({
            success : true,
            message : 'Login successful'
        });

    }
    catch ( err ){
        return res.status(500).json({
            status : false,
            message : 'Server Error',
            error : err.message
        });
    }
}


const getCustomerProfile = async(req, res) => {
    try{
        return res.status(200).json(req.user);
    }   
    catch (err){
        return res.status(500).json({
            success : false,
            message : 'Server Error',
            error : err.message
        });
    }
};


const logoutCustomer = async (req, res) => {
    try{
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
        });

        return res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Server Error',
            error: err.message
        });
    }
};


const changePassword = async (req, res) => {
    try{
        const {oldPassword, newPassword} = req.body;

        if(!oldPassword || !newPassword){
            return res.status(400).json({
                success:false,
                message:'Please provide both oldPassword and newpassword'
            });
        }


        if(newPassword.length < 6){
            return res.status(400).json({
                success:false,
                message:'New password must contain at least 6 letters'
            });
        }


        // fetch customer with password explicitly selected
        const customer = await CustomerModel.findById(req.user._id);


        const ispasswordmatch = await bcrypt.compare(oldPassword, customer.password);
        if(!ispasswordmatch){
            return res.status(401).json({
                success:false,
                message: "Incorrect old password"
            });
        }


        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(newPassword, salt);


        customer.password = hashedpassword;
        await customer.save();


        return res.status(200).json({
            success:false,
            message : 'Password updated successfully'
        });

    }
    catch(err){
        return res.status(500).json({
            success:false,
            message : 'Server Error',
            error: err.message
        });
    }
};


module.exports = {
    registerCustomer,
    loginCustomer,
    getCustomerProfile,
    logoutCustomer,
    changePassword
};