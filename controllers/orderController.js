const OrderItem = require('../models/order-item')
const Order = require('../models/orderModel')

// for posting order
exports.postOrder = async(req,res)=>{
    const orderItemsIds = Promise.all(req.body.orderItems.map(async(orderItem)=>{
        let newOrderItem = new OrderItem({
            quantity:orderItem.quantity,
            product : orderItem.product
        })
        newOrderItem = await newOrderItem.save()
        return newOrderItem.id
    }))
    const orderItemsIdsResolved = await orderItemsIds

    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async(orderItemId)=>{
        const orderItem = await OrderItem.findById(orderItemId).populate('product','product_price')
        const total = orderItem.quantity * orderItem.product.product_price
        return total
    }))
    const totalPrice = totalPrices.reduce((a,b)=>a+b,0)

    let order = new Order({
        orderItems:orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2:req.body.shippingAddress2,
        city:req.body.city,
        country:req.body.country,
        zip:req.body.zip,
        phone:req.body.phone,
        status:req.body.status,
        totalPrice:totalPrice,
        user:req.body.user
    })
    order  = await order.save()
    if(!order){
        return res.status(400).jason({error:'something went wrong'})
    }
    res.send(order)
}
//get order list
exports.orderList = async(req,res)=>{
    const order = await Order.find().populate('user','name').sort({dateOrdered:-1}) //-1 is sorting in descending order
  
    if(!order){
        return res.status(400).jason({error:'something went wrong'})
    }
    res.send(order)
}
// get order details
exports.orderDetails = async(req,res)=>{
    const order = await Order.findById(req.params.id)
    .populate('user','name')
    .populate({
        path:'orderItems',populate:{
            path:'product',path:'category'
        }
    })
}

//update status
exports.updateStatus = async(req,res)=>{
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status:req.body.status
        },
        {new:true}
    )
    if(!order){
        return res.status(400).jason({error:'something went wrong'})
    }
    res.send(order)
}

//delete order
exports.deleteOrder = (req,res)=>{
    Order.findByIdAndRemove(req.params.id).then(async(order)=>{
        if(order){
            await order.orderItems.map(async orderItem =>{
                await OrderItem.findByIdAndRemove(orderItem)
            })
            return res.json({message:'the order has been deleted'})
        }
        else{
            return res.status(400).json({error:'order not found'})
        }
    })
    .catch(err => {return res.status(400).json({error:err})
})
}

//user orders
exports.userOrders = async(req,res)=>{
    const userOrderList = await Order.find({user:req.params.userid})
    .populate({
        path:'orderItems',populate:{
            path:'product',populate:'category'
        }
    }).sort({dateOrdered:-1})
    if(!userOrderList){
        return res.status(500).json({error:'something went wrong'})
    }
    res.send(userOrderList)
}