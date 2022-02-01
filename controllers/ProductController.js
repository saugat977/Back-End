const Product = require('../models/productModel')
const path = require('path')
// to insert product

exports.postProduct = async(req,resp)=>{
    let product = new Product({
       product_name:req.body.product_name,
       product_price:req.body.product_price,
       countInStock:req.body.countInStock,
       product_description:req.body.product_description,
       product_image:req.file.path,
       
       category:req.body.category
    })
    
    product = await product.save()
   
    if(!product){
        return resp.status(400).json({error:"something went wrong"})

    }
    // resp.send() to send data in postman
    resp.send(product)
}

//product list
exports.productList= async(req,resp)=>{
    
    let order = req.query.order  ? req.query.order : 'asc' //req.query reads the data passed by ? and order is the order at front end
    let sortBy = req.query.order ? req.query.sortBy : '_id'
    let limit = req.query.order ? parseInt(req.query.limit) :1000

    const product = await Product.find()
    .populate('category')
    .sort([[sortBy,order]])
    .limit(limit)
    
    if(!product){
        return resp.status(400).json({error:"something went wrong"})

    }
    resp.send(product)
}

//product details

exports.productDetails = async(req,resp)=>{
    const product = await Product.findById(req.params.id)
    if(!product){
        return resp.status(400).json({error:"something went wrong"})

    }
    resp.send(product)
}

//product update
exports.updateProduct = async(req,resp)=>{
    const product = await Product.findByIdAndUpdate(req.params.id,{
        product_name:req.body.product_name,
       product_price:req.body.product_price,
       countInStock:req.body.countInStock,
       product_description:req.body.product_description,
       product_image:req.body.product_image,
       category:req.body.category
    },{new:true}
    )
    if(!product){
        return resp.status(400).json({error:"something went wrong"})

    }
    resp.send(product)
}

//to delete
exports.deleteProduct = async(req,resp)=>{
   const product = await Product.findByIdAndRemove(req.params.id).then(product=>{
        if(!category){
        return resp.status(400).json({error:'product not found'})
        }
        else{
            return resp.status(200).json({message:'product deleted'})
        }
    })
    .catch(err=>{
        return res.status(400).json({error:err})
    })}

    //related products to same category
    exports.listRelated = async(req,res)=>{
        let single_product = await Product.findById(req.params.id)
        let limit = req.query.limit ? parseInt(req.params.limit) : 6
        let product = await Product.find({_id:{$ne:single_product},category:single_product.category}
            )
            .limit(limit)
            .populate('category','category_name')

            if(!product){
                return res.status(400).json({error:"something went wrong"})
        
            }
            res.send(product)
    }

    // filter by category and price range
    exports.listBySearch = async(req,res)=>{
        let order = req.body.order ? req.body.order :'desc'
        let sortBy = req.body.sortBy ? req.body.sortBy : '_id'
        let limit = req.body.limit ? parseInt(req.body.limit) : 2000
        let skip = parseInt(req.body.skip)
        let findArgs ={}

        for(let key in req.body.filters){
            if(req.body.filters[key].length >0){
                if(key ==="product_price"){
                    //gte --> greater than
                    // lte --> less than
                    findArgs[key]={
                        $gte:req.body.filters[key][0],
                        $lte:req.body.filters[key][1]
                    }
                }
                else{
                    findArgs[key] = req.body.filters[key]
                }
            }
        }
        const product = await Product.find(findArgs)
        .populate('category')
        .sort([[sortBy,order]])
        .limit(limit)
        .skip(skip)
        
        if(!product){
            return res.status(400).json({error:'something went wrong'})
        }
        res.json({
            size:product.length,
            product
        })
    }