const express = require ("express");
const {validationResult} = require ('express-validator');
const multer = require("multer");
const productsRepo = require("../../repositories/products");
const productsNewTemplate = require('../../Views/admin/products/newProduct');
const {requireTitle,requirePrice} = require("./validators");

const router = express.Router();
const upload = multer({storage:multer.memoryStorage()});
router.get("/admin/products",(req,res) => {

});


router.get("/admin/products/new",(req,res) => {
    res.send(productsNewTemplate({}));
});

router.post ('/admin/products/new', [requireTitle,requirePrice], upload.single('image') ,(req,res) =>{
    const errors = validationResult(req);

    console.log(req.file);
    
    res.send ('submitted')
})
module.exports = router;