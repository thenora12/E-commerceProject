const mongoose=require('mongoose');
const categoryShema=new mongoose.Schema({
    name:{
        type:String,
        require:true,
     
        trim:true

    }
},{timestamps:true})
module.exports=mongoose.model('Category',categoryShema);