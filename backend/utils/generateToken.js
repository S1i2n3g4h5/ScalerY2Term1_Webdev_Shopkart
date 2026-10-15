const jwt = require('jsonwebtoken');
const { model } = require('mongoose');

const generateToken = (res, customerId) =>{
    const token = jwt.sign({id:customerId}, process.env.JWT_SECRET, {
        expiresIn:'1d',
    });

    res.cookie('jwt', token , {
        httpOnly:true,  // prevngint XSS script
        secure:process.env.NODE_ENV === 'production',
        sameSite:'strict',   // proect against csrf
        maxAge:24*60*60*1000, // 1day
    })

    return token;
}


module.exports = generateToken;