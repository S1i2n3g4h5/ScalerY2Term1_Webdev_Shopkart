const dns = require('dns');
dns.setServers(['1.1.1.1']); // the nodekjs to bypasss dns resolver and use cloudfare server

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const dotenv = require('dotenv');
dotenv.config();


// importing router
const customerRoutes = require('./routes/customer.routes');
const productRoutes = require('./routes/product.routes');
const wishlistRoutes = require('./routes/wishlist.routes')
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require("./routes/order.routes");


const app = express();
app.use(cors({
    origin : "http://localhost:5173",  // vite default development server url;
    credentials:true,  // allowing httponly cookies to cross ports
}))
app.use(express.json()) // pases incoming json paylod
app.use(cookieParser()) // parses incoming cookies into req.cookies;


// mount cusotmer routes;
app.use('/customers', customerRoutes);
app.use('/products', productRoutes);
app.use('/wishlist', wishlistRoutes)
app.use('/cart', cartRoutes);
app.use("/orders",orderRoutes);

app.get('/', (req, res) => {
    res.send('ShopKar Bakcned API is up and runing');

});

const PORT = process.env.PORT || 5000;


mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Successfutlly conencted to mongodb atlast');

        app.listen(PORT, () => {
            console.log(`Server listening on port - ${PORT}`);
        })
    })
    .catch((err) => {
        console.error('Mongodb connection erorr - ', err.message);
    })