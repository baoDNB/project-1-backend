const express = require("express");
const router = express.Router()
const useController= require('../controllers/UserController');
const { authMiddleWare,authUserMiddleWare } = require("../middleware/authMiddleware");

router.post('/sign-up',useController.createUser)
router.post('/sign-in',useController.loginUser)
router.post('/log-out',useController.logoutUser)
router.put('/update-user/:id',authUserMiddleWare,useController.updateUser)
router.delete('/delete-user/:id',authMiddleWare ,useController.deleteUser)
router.get('/getAll',authMiddleWare ,useController.getAllUser)
router.get('/get-details/:id',authUserMiddleWare ,useController.getDetailsUser)
router.post('/refresh-token',useController.refreshToken)
router.post('/delete-many',authMiddleWare,useController.deleteMany)




module.exports = router