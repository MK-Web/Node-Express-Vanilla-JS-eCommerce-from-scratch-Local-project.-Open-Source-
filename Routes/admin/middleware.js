const {validationResult} = require('express-validator');
//Middleware fns

module.exports = {
    handleErrors(templateFunc, dataCb) {
        return async (req,res,next) => {
            const errors = validationResult(req);
        
            if(!errors.isEmpty()) {
                // defaining data variable
                let data={};
                //First check if data callback(cb) exists
                if(dataCb) {

                    //assigning valude to data variable
                   data = await dataCb(req);
                }
                return res.send(templateFunc({errors, ...data}));
            }
            next();
        };
    },
        requireAuth(req,res,next) {
            if(!req.session.userId){
                return res.redirect('/signin');
            }
            next();
        }
};