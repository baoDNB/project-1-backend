const express = require("express");
const router = express.Router()
const OrderController = require("../controllers/OrderController");
const { authUserMiddleWare, authMiddleWare } = require("../middleware/authMiddleware");

router.post('/create', OrderController.createOrder)
router.get('/get-all-order/:id', authUserMiddleWare, OrderController.getAllDetailsOrder)
router.get('/get-details-order/:id', authUserMiddleWare, OrderController.getDetailsOrder)
router.delete('/cancel-order/:id',  OrderController.cancelOrderDetails)
router.get('/get-all-order',authMiddleWare, OrderController.getAllOrder)




module.exports = router