const req = require("express/lib/request");
const res = require("express/lib/response");

//next is used to pass from one function to another
exports.productValidation = (req,res,next)=>{
    
    req.check('product_name','Product name is Required').notEmpty()
    req.check('product_price','product price is required').notEmpty()
    .isNumeric()
    .withMessage('Price only contains numeric values')
    req.check('countInStock','Stock number is required').notEmpty()
    .isNumeric()
    .withMessage('Stock only contains numeric values')
    req.check('product_description','description is required')
    .isLength({
        min:20
    })
    .withMessage('description must consists of minimum 20 characters')
    req.check('category','Category is Required').notEmpty()

    //to pass messages defined above
    const errors = req.validationErrors()
    if(errors){
        const showError=errors.map(err=> err.msg)[0]
        return res.status(400).json({error:showError})
    }
    //to pass into another function
    next()
}