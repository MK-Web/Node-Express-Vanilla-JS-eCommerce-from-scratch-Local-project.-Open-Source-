const express = require ('express');
const bodyParser = require ('body-parser');
const cookieSession = require ('cookie-session');
const authRouter = require ('./Routes/admin/auth');
const { response, static } = require('express');
const productRoutes = require ("./Routes/admin/Products");
const app = express();

app.use(express.static("Public"));
app.use (bodyParser.urlencoded({extended:true})); 
app.use (cookieSession({
    keys:["sdasdasdasdasd"]
}));
app.use(authRouter);
app.use(productRoutes);
app.listen (3000, () =>{
    console.log('listening');
});