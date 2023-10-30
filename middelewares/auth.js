const expressJWT=require("express-jwt");
require('dotenv').config();
exports .requireSignIn=expressJWT({
    secret:process.env.JWT_secret,
    algorithms:["H5256"],
    userProperty:'auth'
})