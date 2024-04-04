const { validate } = require("../services/auth");

function checkForCookie(cookieName){
    return (req, res, next) =>{
        const token = req.cookies[cookieName];
        if(!token){
            return next();
        }

        try{
            const payload = validate(token);
            req.user = payload;
        }catch(err){}
        
        return next();
    }
}

module.exports = {
    checkForCookie
}