const User = require ('../models/authModel')
const Token = require('../models/tokenModel')
const sendEmail = require('../utils/setEmail')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')  //authentication
const expressJwt = require('express-jwt')  //authorization
const res = require('express/lib/response')

//register user and send email confirmation link

exports.userRegister = async(req,res)=>{
    let user = new User({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    })
    user = await user.save()
    if(!user){
        return res.status(400).json({error:'something went wrong'})
    }
    let token = new Token({
        token:crypto.randomBytes(16).toString('hex'),
        userId:user._id
    })
    token = await token.save()
    if(!token){
        return res.status(400).json({error:'something went wrong'})
    }
const url = process.env.FRONTEND_URL+'\/email\/conformation\/'+token.token

    //send email
    sendEmail({
        from:'no-reply@ecommerce.com',
        to: user.email,
        subject:'Email verification link',
        text: `Hello, \n\n Please confirm your email by copying the link :\n\n http:\/\/${req.headers.host}\/api\/conformation\/${token.token}`,
        //http://localhost:5000/api/comformation/56575aebdebc9

        html:` 
        <h2>Verify your Email<h2>
        <button><a href = ${url}>Verify</a></button>
        `
    
    })
    res.send(user)
}

//post email conformation
exports.postEmailConformation=(req,res)=>{
//firstly, find the valid matching token.
Token.findOne({token:req.params.token},(error,token)=>{
    if(error || !token){
        return res.status(400).json({error:'invalid token or token may have expired'})

    }
    // if token is found then find the valid user for that token
    User.findOne({_id:token.userId},(error,user)=>{
        if(!user || error){
            return res.status(400).json({error:'we are unable to find the valid user for this token'})
        }
        //to check if user is already verified
        if(user.isVerified){
            return res.status(400).json({error:'email has already been verified, login to continue'})
        }
        // save the verified user
        user.isVerified = true
        user.save((error)=>{
            if(error){
                return res.status(400).json({error:error})
            }
            res.json({message:'congrats, your email has been verified successfully'})
        })
    })
})
}

//sigin 
exports.signIn =async(req,res)=>{
    const {email,password} = req.body
    //firstly find whether the email registered or not
    const user = await User.findOne({email})
    if(!user){
        return res.status(400).json({error:'sorry the email you provided is not found in our system. Please try another time'})
    }
    //if email is found then password is checked
    if(!user.authenticate(password)){
        return res.status(400).json({error:'email and password does not match'})
    }
    //check if user is verified or not
    if(!user.isVerified){
        return res.status(400).json({error:'please verify your email before proceeding'})
    }
    // now generate token using user id and jwt_secret
    const token = jwt.sign({_id:user._id},process.env.JWT_SECRET)
    //now store the token in cookie
    res.cookie('myCookie',token,{expire: Date.now() + 999999})
    // to send user information in frontend
    const {_id,role,name} = user
    return res.json({token,user:{name,email,_id,role}})
}

//signout
exports.signout=(req,res)=>{
    res.clearCookie('myCookie')
    res.json({message:'signout success'})
}

//forgot password
exports.forgetPassword = async(req,res)=>{
    const user =await User.findOne({email:req.body.email})
    if(!user){
        return res.status(400).json({error:'sorry the email you provided is not fond in our system'})
    }
     let token = new Token({
        token:crypto.randomBytes(16).toString('hex'),
        userId:user._id
    })
    token = await token.save()
    if(!token){
        return res.status(400).json({error:'something went wrong'})
    }
    const url = process.env.FRONTEND_URL+ '\/reset\/password\/'+token.token
    //send email
    sendEmail({
        from:'no-reply@ecommerce.com',
        to: user.email,
        subject:'Reset Password Link',
        text: `Hello, \n\n Please reset your password by copying the link :\n\n http:\/\/${req.headers.host}\/api\/resetpassword\/${token.token}`,
        html:` 
        <h2>Reset your Password<h2>
        <button><a href = ${url}>Click to Reset</a></button>
        `
        
    
    })
    res.json({message:'password reset link has been sent to your email'})
}

// reset password
exports.resetPassword = async(req,res)=>{
//firstly find the valid matching token
let token = await Token.findOne({token:req.params.token})
if(!token){
     return res.status(400).json({error:'invalid token or token may have expired'})
}
//if token is found then find the valid user
let user = await User.findOne({
    email:req.body.email,
    _id:token.userId
})
if(!user){
    return res.status(400).json({error:'we are unable to find the valid user for this token'})
}
user.password = req.body.password
user=await user.save()
if(!user){
    return res.status(400).json({error:'failed to reset password'})
}
res.json({message:'password has been reset successfully'})
}

//user list
exports.userList = async(req,res)=>{
    const user = await User.find().select('-hashed_password')
    if(!user){
        return res.status(400).json({error:'something went wrong'})
    }
    res.send(user)
}

// single user
exports.userDetails = async(req,res)=>{
    const user = await User.findById(req.params.id).select('-hashed-password')
    if(!user){
        return res.status(400).json({error:'something went wrong'})
    }
    res.send(user)
}

// resend verification email
exports.resendVerificationMail = async(req,res)=>{
    // at first find the registered user
    const user =await User.findOne({email:req.body.email})
    if(!user){
        return res.status(400).json({error:'sorry the email you provided is not fond in our system'})
    }
   // check if the user is already verified
   if(user.isVerified){
       return res.status(400).json({error:'email has already been verified, login to continue'})
   }
   // create token to store in database and send to the email as params
  let token = new Token({
    token:crypto.randomBytes(16).toString('hex'),
    userId:user._id
  })
   token = await token.save()
   if(!token){
   return res.status(400).json({error:'something went wrong'})
}
   // send email
sendEmail({
    from:'no-reply@ecommerce.com',
    to: user.email,
    subject:'Email verification link',
    text: `Hello, \n\n Please confirm your email by copying the link :\n\n http:\/\/${req.headers.host}\/api\/conformation\/${token.token}`
    //http://localhost:5000/api/comformation/56575aebdebc9

})
res.json({message:'verification link has been sent to your mail'})

}

//change password
// exports.changePassword = async(req,res)=>{
//     let {email,password} = req.body
//     const user = await User.findOne({email})
//     if(!user){
//         return res.status(400).json({error:'sorry the email you provided is not found in our system. Please try another time'})
//     }
//     //if email is found then password is checked
    
//     if(!user.authenticate(password)){
//         return res.status(400).json({error:'email and password does not match'})
//     }
//     //check if user is verified or not
//     if(!user.isVerified){
//         return res.status(400).json({error:'please verify your email before proceeding'})
//     }
    
// user.password = req.body.new_password
// user=await user.save()
// if(!user){
//     return res.status(400).json({error:'failed to change password'})
// }
// res.json({message:'password has been changed successfully'})

// }

//authorization
exports.requireSignin = expressJwt({
    secret:process.env.JWT_SECRET,
    algorithms:['HS256'],
    userProperty:'auth'
})