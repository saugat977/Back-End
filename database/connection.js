const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE,{
    //to parse data 
    useNewUrlParser :true,
    //to send unified data
    useUnifiedTopology:true
})
.then(()=> console.log('database connected'))
.catch(err=>console.log(err))