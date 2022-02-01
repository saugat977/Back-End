const express = require('express')
require('dotenv').config()
const db = require('./database/connection')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const categoryRoute = require('./routes/categoryRoute')
const productRoute = require('./routes/productRoute')
//const { productList, productDetails, updateProduct, deleteProduct, postProduct } = require('./controllers/ProductController')
const authRoute = require('./routes/authRoute')
const orderRoute = require('./routes/orderRoute')
const paymentRoute = require('./routes/paymentRoute')


//the variable express is the const variable i
const app = express()

//middleware
app.use(express.static("public"));
app.use(bodyParser.json())
app.use(expressValidator())
// to access static files express.static is used
app.use('/public/uploads',express.static('public/uploads'))
app.use(cookieParser())
app.use(cors())
//defining route
// app.get('/hello',(req,resp)=>{
//     resp.send('Welcome to express and nodemon')
// })

//routes
app.use('/api',categoryRoute)  // the /api is the prefex necessary
app.use('/api',productRoute)
// app.use('/api',postProduct)
// app.use('/api',productList)
// app.use('/api',productDetails)
// app.use('/api',updateProduct)
// app.use('/api',deleteProduct)
app.use('/api',authRoute)
app.use('/api',orderRoute)
app.use('/api',paymentRoute)



// taking port from .env file
const port = process.env.PORT || 5000

// to search for port
app.listen(port,()=>{
    console.log(`server started on port ${port}`)
})



