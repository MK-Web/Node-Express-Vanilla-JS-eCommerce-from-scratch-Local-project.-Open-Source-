const { check } = require ("express-validator");
const usersRepo = require ("../../repositories/users");

module.exports = {
    requireTitle:check('title')
    .trim()
    .isLength({min:5,max:50})
    .withMessage("Must be between 5 and 50 characters")
    ,
    requirePrice:check("price")
    .trim()
    .toFloat()
    .isFloat({min:1})
    .withMessage("Must be a number greater than 1")
    ,
    requireEmail:check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Email must be valid")
    .custom(async(email)=>{
        const existingUser = await usersRepo.getOneBy({email});
        if (existingUser) {
            throw new Error ("Email in use!");
        }
    }),
        requirePassword:check("password")
        .trim()
        .isLength({min:4,max:20})
        .withMessage("Password must be 4-20 characters length"),
        requireConfirmation:check("passwordConfirmation")
        .trim()
        .isLength({min:4,max:20})
        .withMessage("Password must be 4-20 characters length"),
        requireEmailExists:check("email")
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Must provide a valid Email')
        .custom(async(email)=>{
            const user = await usersRepo.getOneBy({email});
            if(!user) {
                throw new Error ("Email not found");
            }
        }),
    requireValidPasswordforUser:check("password")
    .trim()
    .isLength({min:4,max:20})
    .custom(async(password,{ req })=>{
        const user = await usersRepo.getOneBy({email: req.body.email});
        if(!user) {
            throw new Error("Invalid password");
        }
        const validPassword = await usersRepo.ComparePassword(
            user.password,
            password
        );
        if(!validPassword){
            throw new Error ('Invalid password');
        }
    })
};