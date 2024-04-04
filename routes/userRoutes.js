const {Router} = require('express');
const User = require("../models/userModel");

const router = Router();

router.get('/signup',(req,res)=>{
    return res.render('signUp');
});

router.get('/signin',(req,res)=>{
    return res.render('signIn');
})


router.post('/signup',async (req,res)=>{
    const {fullName, email, password} = req.body;
    await User.create({
        fullName: fullName, 
        email: email, 
        password: password});

    return res.redirect("/user/signin");
})


router.post('/signin',async (req,res)=>{
    const {email, password} = req.body;
    try{
        const token = await User.checkPassword(email,password);
        return res.cookie("token", token).redirect("/");
    }catch(err){
        return res.render("signin",{error: "Incorrect email/password"});
    }
   
})


router.get('/logout',(req,res)=>{
    res.clearCookie('token').redirect("/");
   
})

module.exports = router;