
const formidable=require('formidable');
const Joi=require('joi');
const fs=require('fs');
const { required, string } = require('joi');
const _=require('lodash');
const { join } = require('path');
const Product=require('./models/product');
exports.CreateProduct=(req,res)=>{
    let form=new formidable.IncomingForm();
    form.keepExtensions=true;
    form.parse(req,(err,fields,files)=>{
        if(err){
            return res.status(400).json({
                error:'image could not upload' +err
            })
        }
        let product =new Product(fields);
        if(files.photo){
          if(files.photo.size>Math.pow(10,6)){
            return res.status(400).json({
                error:'image must be less than 1Mb in size'
            })
          }
            product.photo.data=fs.readFileSync(files.photo.filepath);
            product.photo.contentType=files.photo.contentType;
        }
        console.log(product.photo.data)
        const schema=Joi.object({
            name:Joi.string().required(),
            description:Joi.string().required(),
            price:Joi.required(),
            quantity:Joi.number(),
            solde:Joi.number()
            ,category:Joi.required(),
            shipping:Joi.bool()
        })
        const {error}=schema.validate(fields);
        
        if(error){
            return res.status(400).json({
                error:error.details[0].message +error
            })
        }
        
        product.save((err,product)=>{
            if(err){
                return res.status(400).json({
                    error:'product not persist'
                })
            }
            return res.json({product,photo:product.phot}) && console.log(product.photo)
            
        })
       
    })
  
}
exports.showProduct=(req,res)=>{
    req.product.photo=undefined;

return res.json({
product:req.product
})
}
exports.productById=(req,res,next,id)=>{
Product.findById(id).exec((err,product)=>{
    if(err || !product){
        return res.status(404).json({error:'product not found'})
    }
    req.product=product;
    next();
})
}
exports.deleteProduct=(req,res)=>{
    let product=req.product;
    product.remove((err,product)=>{
        if(err){
            return res.status(404).json({
                error:'product not found !'
            })
        }
        return res.status(204).json({})
    })
}
exports.updateProduct=(req,res)=>{
    let form=new formidable.IncomingForm();
    form.keepExtensions=true;
    form.parse(req,async(err,fields,files)=>{
        if(err){
            return res.status(400).json({
                error:'image could not upload'
            })
        }
        let product =req.product;
        product=_.extend(product,fields)
        if(files.photo){
          if(files.photo.size>Math.pow(10,6)){
            return res.status(400).json({
                error:'image must be less than 1Mb in size'
            })
          }
            product.photo.data=fs.readFileSync(files.photo.filepath);
            product.photo.contentType=files.photo.type;
        }
        const schema=Joi.object({
            name:Joi.string().required(),
            description:Joi.string().required(),
            price:Joi.required()
            
        })
        const {error}=schema.validate(fields);
        if(error){
            return res.status(400).json({
                error:error.details[0].message
            })
        }
        product.save((err,product)=>{
            if(err){
                return res.status(400).json({
                    error:'product not updated'
                })
            }
            return res.json({product,photo:product.photo})
        })
    })
}
exports.allProducts=(req,res)=>{
    let sortBy=req.query.sortBy ? req.query.sortBy:'_id';
    let order=req.query.order ? req.query.order:'asc'
    let limit=req.query.limit ? parseInt(req.query.limit):6
    let query={};
    let {search}=req.query;
    let category=req.query.category;
    if(search){
        query.name={$regex:search,$options:'i'}
    }
    if(category){
        query.category=category;
    }
    console.log(query)
 Product.find(query) 
  
        .select()
        .populate('category')
        
        .sort([[sortBy,order]])
        .limit(limit)
        .exec((err,products)=>{
            if(err)
                {       return res.status(404).json({error:'products not found   '+err})

    }
     return res.json({products})
            })
}
exports.relatedProduct=(req,res)=>{
    let limit=req.query.limit ? parseInt(req.query.limit):6
    Product.find({_id:{$ne:req.product._id},category:req.product.category})
           .limit(limit)
           .select('-photo')
           .exec((err,products)=>{
            if(err){
                return res.status(404).json({error:err})
            }
            return res.json({products})
        })
}

exports.searchProduct=(req,res)=>{

    let sortBy=req.body.sortBy ? req.body.sortBy:'_id';
    let order=req.body.order ? req.body.order:'asc'
    let limit=req.body.limit ? parseInt(req.body.limit):6
    let skip=parseInt(req.body.skip);
    let findArgs={}
    for (let key in req.body.filters){
        if(req.body.filters[key].length>0){
            if(key==='price' ){
                findArgs[key]={
                    $gte:req.body.filters[key][0],
                    $lte:req.body.filters[key][1]
                }
            }}
            else{
                findArgs[key]=req.body.filters[key]
            }
            console.log(req.body.filters) 
        }
 Product.find(findArgs)  
        .select('-photo')
        .populate('category')
        .sort([[sortBy,order]])
        .limit(limit)
        .skip(skip)
        .exec((err,products)=>{
            if(err)
                {       
                return res.status(404).json({error:'products not found'})

    }
     return res.json({products})
            })
        } 
exports.getImage=(req,res)=>{
    const {data,contentType}=req.product.photo;
    if(data){
        res.set('Content-Type',contentType)
        return res.send(data)
    }
    
}