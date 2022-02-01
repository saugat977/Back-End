//const res = require('express/lib/response')
const Category = require('../models/categoryModel')

//to export a function
exports.demoFunction=(req,resp) =>{
    resp.send('this is accessed from the controller')
}


// to post category

exports.postCategory = async(req,res)=>{
    let category = new Category({
        category_name:req.body.category_name
    })
    Category.findOne({category_name:category.category_name}, async(error,data)=>{
        if(data=== null){
            category = await category.save()
    if(!category){
        return res.status(400).json({error:'Something went wrong'})
    }
    res.send(category)
        }
        else{
            return res.status(400).json({error:'category must be unique'})
        }
    })
    
}

// to show all category
exports.categoryList = async(req,resp)=>{
    const category = await Category.find()
    if(!category){
        return resp.status(400).json({error:'something went wrong'})
    }
    resp.send(category)
}

//to show single category
exports.categoryDetails = async(req,resp)=>{
    const category = await Category.findById(req.params.id)
    if(!category){
        return resp.status(400).json({error:'something went wrong'})
    }
    resp.send(category)
}

//to update category
exports.updateCategory = async(req,resp)=>{
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {category_name:req.body.category_name},
        {new:true}
    )
    if(!category){
        return resp.status(400).json({error:'something went wrong'})
    }
    resp.send(category)
}

//to delete category
exports.deleteCategory = (req,resp)=>{
    Category.findByIdAndRemove(req.params.id).then(category=>{
        if(!category){
        return resp.status(400).json({error:'category not found'})
        }
        else{
            return resp.status(200).json({message:'category deleted'})
        }
    })
    .catch(err=>{
        return res.status(400).json({error:err})
    })
    
}