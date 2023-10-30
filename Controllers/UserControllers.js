const user = require ('../models/user');
 const jwt=require('jsonwebtoken')
 exports.site((req,res) => {res.send('users module');})
exports.signup=(req,res)=>{
    const user=new user(req.body);
    user.save((err,user)=>{
        if(err){
            return res.status(400).send(err)
        }
        res.send(user)
    })
}
exports.signin=(req,res)=>{const {email,password}=req.body
        User.fidOne({email},(err,user)=>
        {
            if(err ||!user){
                return res.status(400).json
                error:'user not found with this email,please signUp !'
            }
        })

        if(!User.authenticate(password)){
            return res.status(401).json({
                error:'email and password'
            })
            const token=jwt.sign({_id:user._id},process.env.JWT_SECRET);
            res.cookie('token',token,{expire:new Date() + 8062000})
            const{_id,name,email,role}=user;
            return res.json({
                token,user:{_id,name,email,role}
            })
        }


}
exports.signout=(req,res)=>{
    res.clearCookie('token');
    res.json({
        message:"user signout"
    })
}