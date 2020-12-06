const express = require ("express");
const multer = require("multer");
const {handleErrors,requireAuth} = require ('./middleware');
const productsRepo = require("../../repositories/products");
const productsNewTemplate = require('../../Views/admin/products/newProduct');
const productsIndexTemplate = require('../../Views/admin/products/index');
const productsEditTemplate = require("../../Views/admin/products/edit");
const {requireTitle,requirePrice} = require("./validators");
const products = require("../../Views/admin/products/index");

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
}
);

router.get('/admin/products/:id/edit',requireAuth,async(req,res) =>{
    const product = await productsRepo.getOne(req.params.id);

    if(!product) {
        return res.send("product not found");
    }

    res.send(productsEditTemplate({product}));
});

router.post("/admin/products/:id/edit", 
requireAuth,
upload.single('image'),
[requireTitle,requirePrice],
// Passing second argument fn to handleErrors Middleware for checking
// invalid type of forms in edit products route and not
// throwing an error
// returning product object , somehow must be passed to template
handleErrors(productsEditTemplate, async(req)=>{
    const product = await productsRepo.getOne(req.params.id);
    return{product};
}),
    async (req,res)=>{
        const changes = req.body;
        if(req.file) {
            changes.image = req.file.buffer.toString('base64');
        }

        try{
        await productsRepo.update(req.params.id,changes)
        } catch(err) {
            return res.send("Could not find item");
        }
        res.redirect('/admin/products');
    }
);
module.exports = router;