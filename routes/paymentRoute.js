const express = require('express')
const { requireSignin } = require('../controllers/authController')
const router = express.Router()
const { processPayment, sendStripeApi } = require('../controllers/paymentController')


router.post('/payment/process', requireSignin, processPayment)
router.get('/stripeapi',sendStripeApi)

module.exports = router