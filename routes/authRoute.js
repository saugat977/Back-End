const express = require('express')
const router = express.Router()
const { userRegister,postEmailConformation,signIn,signout,
forgetPassword,resetPassword,userList, userDetails, resendVerificationMail, changePassword, requireSignin } = require('../controllers/authController')


router.post('/register',userRegister)
router.post('/conformation/:token',postEmailConformation)
router.post('/signin',signIn)
router.post('/signout',requireSignin,signout)
router.post('/forgetpassword',forgetPassword)
router.put('/resetpassword/:token',resetPassword)
router.get('/userlist',requireSignin,userList)
router.get('/userinfo/:id',requireSignin,userDetails)
router.post('/resendverification',resendVerificationMail )
// router.post('/changepassword',changePassword)


module.exports = router