const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes')
const cookieParser = require('cookie-parser');
const { checkForCookie } = require('./middlewares/checkUserStatus');


const app = express();
const PORT = 8000;

mongoose
  .connect("mongodb://127.0.0.1:27017/blog")
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
});

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,"/views"));

app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(checkForCookie("token"));

app.get("/", (req,res)=>{
   return res.render('home',{
    user: req.user
   });
});

app.use("/user", userRoutes);

app.listen(PORT, ()=>{
    console.log(`server started at port: ${PORT}`);
})