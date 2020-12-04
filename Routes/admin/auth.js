const express = require('express');
const { check,validationResult } = require('express-validator');
const usersRepo = require('../../repositories/users');
const router = express.Router();
const signUpTemplate = require ('../../Views/admin/auth/signup');
const signInTemplate = require("../../Views/admin/auth/sigin");
const { requireEmail,requirePassword,requireConfirmation,requireEmailExists,requireValidPasswordforUser} = require("./validators");
router.get ("/signup", (req,res) => {
    
    res.send(signUpTemplate({req})); 
});

router.get("/signin",(req,res)=>{
    res.send(signInTemplate(req)); 
});
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
    async (req,res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.send (signUpTemplate({req,errors}));
        }
        const {email,password,passwordConfirmation} = req.body;
       
        if (password !== passwordConfirmation) {
             return res.send('password must match');
        }
        // Create a user in user repo to represent this person 

        // Store the id of that user inside the users cookie 
       const user =  await usersRepo.create ({ email , password  });

       req.session.userID = user.id;

        res.send (
            `
            <h1>You are created account.</h1
            `
        )
});

router.get("/signout", (req,res) => {
  req.session = null;
  res.send("You are logged out");   
});

router.get ("/signin", (req,res) =>{
    res.send ()
});

router.post("/signin", [
    requireEmailExists,
    requireValidPasswordforUser
],
async (req,res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        res.send(signInTemplate({errors}));
    }
    const {email} = req.body;
    const user = await usersRepo.getOneBy({email});
    req.session.userID = user.id;
    res.send("You are signed in!!!"); 
    });

module.exports = router;