const express = require('express')
const router = express.Router()
const { postOrder, orderList, orderDetails, updateStatus, deleteOrder, userOrders } = require('../controllers/orderController')


router.post('/postorder',postOrder)
router.get('/orderlist',orderList)
router.get('/orderdetails/:id',orderDetails)
router.put('/updatestatus/:id',updateStatus)
router.delete('/deleteorder/:id',deleteOrder)
router.get('/userorders/:userid',userOrders)

module.exports = router