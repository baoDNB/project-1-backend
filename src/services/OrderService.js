const Order = require("../models/OrderProduct")
const Product = require("../models/ProductModel")
const bcrypt = require("bcrypt")
const EmailService = require("../services/EmailService")

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        const { orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user, isPaid, paidAt, email } = newOrder
        try {
                const promises= orderItems.map( async(order)=>{
                    const productData = await Product.findByIdAndUpdate(
                        {
                        _id:order.product,
                        countInStock:{$gte :order.amount}
                    },
                    {$inc:{
                        countInStock: -order.amount,
                        selled: +order.amount
                    }},

                    {new: true}
                )
                if (productData ){
                        return{
                            status: 'OK',
                            message: 'SUCCESS',
                        }
                    }else {
                        return{
                            status: 'OK',
                            message: 'ERR',
                            id: order.product
                        }
                }
            })
            const results =  await Promise.all(promises)
            const newData = results && results.filter((item)=>item.id)
            if(newData.length){
                const arrId =[]
                newData.forEach((item)=>{
                    arrId.push(item.id)
                })
                resolve({
                    status: 'ERR',
                    message: `Sản phẩm với id: ${newData.join(',')} không đủ hàng`,
                })

            }else{
                const createdOrder = await Order.create({
                    orderItems,
                    shippingAddress: {
                        fullName,
                        address,
                        city,
                        phone,

                    },
                    paymentMethod,
                    itemsPrice,
                    shippingPrice,
                    totalPrice,
                    user: user,
                    isPaid, paidAt

                })
                if (createdOrder) {
                    await EmailService.sendEmailCreateOrder(email, orderItems)
                    resolve({
                        status: 'OK',
                        message: 'success'
                    })
            }
        } 
        } catch (e) {
            console.log('e', e)
            reject(e)
        }
    })
}
const getAllDetailsOrder = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.find({
                user: id
            })
            if (order === null) {
                resolve({
                    status: 'OK',
                    message: 'The order is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: order

            })
        } catch (e) {
            console.log('e', e)
            reject(e)
        }
    })
}
const getOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById({
                _id: id
            })
            if (order === null) {
                resolve({
                    status: 'OK',
                    message: 'The order is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: order

            })
        } catch (e) {
            console.log('e', e)
            reject(e)
        }
    })
}
const cancelOrderDetails = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let order = []
            const promises = data.map(async (order) => {
                const productData = await Product.findByIdAndUpdate(
                    {
                        _id: order.product,
                        selled: { $gte: order.amount }
                    },
                    {
                        $inc: {
                            countInStock: +order.amount,
                            selled: -order.amount
                        }
                    },

                    { new: true }
                )
                console.log('producData', productData)
                if (productData) {
                    order = await Order.findByIdAndDelete(id)

                    if (order === null) {
                        resolve({
                            status: 'OK',
                            message: 'The order is not defined'
                        })
                    }
                } else {
                    return {
                        status: 'OK',
                        message: 'ERR',
                        id: order.product
                    }
                }
            })
            const results = await Promise.all(promises)
            const newData = results && results.filter((item) => item)
            if (newData.length) {
                resolve({
                    status: 'ERR',
                    message: `Sản phẩm với id ${newData.join(',')} không tồn tại`,
                })

            }
            resolve({
                status: 'OK',
                message: 'success',
                data: order
            })
        } catch (e) {
            reject(e)
        }
    })
}
const getAllOrder =()=>{
    return new Promise(async (resolve, reject) => {
        try {
            const allOrder = await Order.find()
            resolve({
                    status:'OK',
                    message: 'Success',
                    data: allOrder
            })
        } catch (e){
            reject(e)
        }
    })
}
module.exports = {
    createOrder,
    getAllDetailsOrder,
    getOrderDetails,
    cancelOrderDetails,
    getAllOrder
}