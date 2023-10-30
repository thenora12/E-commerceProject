const mongoose=require('mongoose');
const uuid=require('uuid/v1');
const crypto=require('crypto');

const usershema=new mongoose.shema({
      name:{
        type:String,
        trim:true,
        minlength:50,
        required:true},
email:{
   type:string, 
   trim:true,
   maxlength:50,
   required:true,
   unique:true
},
ha_password:{
   type:string, 
   required:true,
},
salt:{
   type:string,
},
rol: {
   type:Number,
   default:0
},
about :{
   type:string,
   trim:true
}
},{timestamps:true})
usershema.virtual('password')
.set(function(password){
     this.password=password;
     this.salt=uuid();
     this.ha_password=this.cryptpassword();
})
usershema.methods={
   authenticate:function (plainText){
      return this.cryptpassword(plainText)===this.ha_password
   },
   cryptpassword:function(password){
   if(!password)
      return '';
   try{
      return crypt
      .createHmac('sha1',this.salt)
      .update(password)
      .digest('hex');
   }catch(error){
      return '';
   }
}
}
module.exports=mongoose.model('user',usershema);