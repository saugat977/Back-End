const multer = require('multer')
//to read folder fs is required
const fs = require('fs')
// to read a extension(name) of a file,image etc
const path = require('path')

const storage = multer.diskStorage({
    //cb is call back(where to send)
    destination:(req,file,cb)=>{
        let fileDestination = 'public/uploads/'
   //check if directory exists
   if(!fs.existsSync(fileDestination)){
       fs.mkdirSync(fileDestination,{recursive:true})
       //recursive:true means it creates parent folder as well as sub folder
       cb(null,fileDestination)
   }
   else{
       cb(null,fileDestination)
   }
    
    },
    filename:(req,file,cb)=>{
        let filename = path.basename(file.originalname,path.extname(file.originalname))
    //path.basename(abc.jpg,.jpg)
    // returns abc (the extension is removed due to path.basename)
    let ext = path.extname(file.originalname)
    cb(null,filename+'_'+Date.now()+ext)
    }
})

let imagefilter = (req,file,cb)=>{
    if (!file.originalname.match(/\.(jpg|png|jpeg|svg|jfif|JPG|PNG|JPEG|SVG|JFIF)$/)){
        return cb(new Error('you can upload image file only'),false)
    }
    else{
        cb(null,true)
    }
}

let upload = multer({
 storage:storage,
 fileFilter:imagefilter,
   limit:{
       fileSize:2000000//kb or 2 mb
   }  
})

module.exports = upload
