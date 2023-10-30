const express=require('express');
const router=express.router();
const {site,signup, signin,signout}=require('../controlls/usercontrollers');
const {userSignUpValidator}= require('../midlewares/uservalidator')
const {requireSignIn}=require(".../middlewares/auth")
router.get('/',site);
router.post('/signup',userSignUpValidator,signup);
router.post('/signin',signin);
router.get('/signout',signout);
router.get("/hello",requireSignIn,(req,res)=>{res.send("hello...")})
module.exports=router;