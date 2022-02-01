const express = require('express')
const { requireSignin } = require('../controllers/authController')
const { demoFunction, postCategory, categoryList, categoryDetails, updateCategory, deleteCategory } = require('../controllers/categoryController')
const router = express.Router()

router.get('/welcome',demoFunction)
router.post('/postcategory',requireSignin,postCategory)
router.get('/categorylist',categoryList)
//the id below should match id at category controller(req.params.id)
router.get('/categorydetails/:id',categoryDetails)
router.put('/updateCategory/:id',requireSignin,updateCategory)
router.delete('/deletecategory/:id',requireSignin,deleteCategory)


//default method of exporting 
module.exports= router
