//Import Express
const express= require('express');
const app=express();
//Config
require('dotenv').config()
const port=process.env.PORT || 5000
let Db=process.env.Database;
const { default: mongoose } = require('mongoose');
//Connection with DaTabase
mongoose.connect(Db)
.then(()=>console.log(' DB connected '))
.catch((e)=>console.log('DB not connected '+e.message))
//Routers
app.get('/',(req,res)=>{
    res.send({message:'salutt'})
})
app.listen(port,()=>{
    console.log(`App is running on port ${port}`)
})
const Category=require('./models/Category')
// Create a new category instance
const newCategory = new Category({
    name: 'Your',
  });
  // Save the new category to the database
  newCategory.save();

