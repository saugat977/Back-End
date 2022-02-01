const mongoose = require('mongoose')
//ObjectId is used to link two tables and find data by id in database
const {ObjectId} = mongoose.Schema

const productSchema = new mongoose.Schema({
    product_name:{
        type:String,
        required:true,
        trim:true
    },
    product_price:{
        type: Number,
        required:true
    },
    countInStock:{
        type:Number,
        required:true
    },
    product_description:{
        type:String,
        required:true
    },
    product_image:{
        type:String,
        required:true
    },
    category:{
        //ObjectId is the id of the corresponding category
        type:ObjectId,
        required:true,
        ref:'Category'
    },
    product_rating:{
        type:Number,
        default:0,
        max:5
    }
},{timestamps:true})
 module.exports = mongoose.model('Product',productSchema)
