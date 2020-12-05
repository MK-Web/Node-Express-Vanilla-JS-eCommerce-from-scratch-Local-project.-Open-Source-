const express = require ("express");
const multer = require("multer");
const {handleErrors,requireAuth} = require ('./middleware');
const productsRepo = require("../../repositories/products");
const productsNewTemplate = require('../../Views/admin/products/newProduct');
const productsIndexTemplate = require('../../Views/admin/products/index');
const {requireTitle,requirePrice} = require("./validators");

const router = express.Router();
const upload = multer( {storage:multer.memoryStorage() });

router.get("/admin/products",requireAuth,async (req,res) => {
    
    const products = await productsRepo.getAll();
    res.send (productsIndexTemplate({products}));
});


router.get("/admin/products/new",requireAuth,(req,res) => {
    
    res.send(productsNewTemplate({}));
});

router.post (
'/admin/products/new',
requireAuth, 
upload.single('image'),
[requireTitle,requirePrice],
handleErrors(productsNewTemplate),
    async  (req, res) => {
    const image = req.file.buffer.toString("base64");
    const { title, price } = req.body;

    await productsRepo.create({ title, price, image });
    res.redirect("/admin/products");
})
module.exports = router;