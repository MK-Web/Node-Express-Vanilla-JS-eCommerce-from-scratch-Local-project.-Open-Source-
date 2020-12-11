const express = require('express');
const {handleErrors} = require ('./middleware');
const usersRepo = require('../../repositories/users');
const router = express.Router();
const signUpTemplate = require ('../../Views/admin/auth/signup');
const signInTemplate = require("../../Views/admin/auth/sigin");
const { requireEmail,requirePassword,requireConfirmation,requireEmailExists,requireValidPasswordforUser} = require("./validators");

router.get ("/signup", (req,res) => {
    res.send(signUpTemplate({req})); 
});
// get 
router.get("/signin",(req,res)=>{
    res.send(signInTemplate(req)); 
});
//MidS
 //Middleware function  bodyParser for POST method
 /*const bodyParser = (req,res,next) => {
    if (req.method === "POST") {
        req.on('data', data=>{
            const parsed = data.toString('utf8').split('&');
            const formData = {};
            for (let pair of parsed) {
                const [key,value] = pair.split('=');
                formData[key] = value;
            }
            req.body = formData;
            next();
        });
    } else {
        next();
    }
   
}; */

router.post("/signup", [
    requireEmail,
    requirePassword,
    requireConfirmation],
    handleErrors(signUpTemplate),
        async (req,res) => {
            const {email,password} = req.body;
            // Create a user in user repo to represent this person 
        // Store the id of that user inside the users cookie 
        const user =  await usersRepo.create ({ email , password  });

        req.session.userId = user.id;

            res.redirect('/admin/products');
    }
);

router.get("/signout", (req,res) => {
  req.session = null;
  res.send("You are logged out");   
});

router.get ("/signin", (req,res) =>{
    res.send (signInTemplate({}));
});

router.post("/signin", [
    requireEmailExists,
    requireValidPasswordforUser
],
handleErrors(signInTemplate),
async (req,res) => { 
    const {email} = req.body;
    const user = await usersRepo.getOneBy({email});
    req.session.userId = user.id;
    res.redirect('/admin/products');
    });

module.exports = router;