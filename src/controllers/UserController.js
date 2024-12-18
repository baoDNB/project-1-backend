const UserService = require('../services/UserService')
const JwtService = require('../services/JwtService')


const createUser = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;
        const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isCheckEmail = reg.test(email);

        if (!email || !password || !confirmPassword) {
            return res.status(400).json({
                status: 'ERR',
                message: 'All fields are required'
            });
        } else if (!isCheckEmail) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Please provide a valid email address'
            });
        } else if (password !== confirmPassword) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Passwords do not match'
            });
        }

        const response = await UserService.createUser(req.body);
        return res.status(201).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Internal Server Error'
        });
    }
};

const loginUser = async(req ,res)=>{
    try{
        const{ email, password} = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail =reg.test(email)
        if( !email || !password ){
            return res.status(400).json({
                status:'ERR',
                message:'Hãy điền các thông tin'
            })
        }else if(!isCheckEmail){
            return res.status(400).json({
                status:'ERR',
                message:'Hãy nhập chính xác email'
            })
        }
        const response = await UserService.loginUser(req.body)
        const { refresh_token, ...newReponse }= response

        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            samesite:'Strict'
        })
        return res.status(200).json(newReponse)
    } catch(e){
        return res.status(404).json({
            message:e
        })
    }
}
const updateUser = async(req ,res)=>{
    try{
        const userId= req.params.id
        const data =req.body
        if(!userId){
            return res.status(200).json({
                status:'ERR',
                message:'The userId is equal required'
            })
        }
        const response = await UserService.updateUser(userId,data )
        return res.status(200).json(response)
    } catch(e){
        return res.status(404).json({
            message:e
        })
    }
}
const deleteUser = async(req ,res)=>{
    try{
        const userId= req.params.id
        if(!userId){
            return res.status(200).json({
                status:'ERR',
                message:'The userId is equal required'
            })
        }
        const response = await UserService.deleteUser(userId )
        return res.status(200).json(response)
    } catch(e){
        return res.status(404).json({
            message:e
        })
    }
}
const deleteMany = async(req ,res)=>{
    try{
        const ids= req.body.ids
        if(!ids){
            return res.status(200).json({
                status:'ERR',
                message:'The ids is equal required'
            })
        }
        const response = await UserService.deleteManyUser(ids )
        return res.status(200).json(response)
    } catch(e){
        return res.status(404).json({
            message:e
        })
    }
}
const getAllUser = async(req ,res)=>{
    try{
        const response = await UserService.getAllUser()
        return res.status(200).json(response)
    } catch(e){
        return res.status(404).json({
            message:e
        })
    }
}
    const getDetailsUser = async(req ,res)=>{
        try{
            const userId= req.params.id
            if(!userId){
                return res.status(200).json({
                    status:'ERR',
                    message:'The userId is equal required'
                })
            }
            const response = await UserService.getDetailsUser(userId )
            return res.status(200).json(response)
        } catch(e){
            return res.status(404).json({
                message:e
            })
        }
    }
const refreshToken = async(req ,res)=>{
    try{
        const token= req.cookies.refresh_token
        if(!token){
            return res.status(200).json({
                status:'ERR',
                message:'The token is required'
            })
        }
        const response = await JwtService.refeshTokenJwtService(token)
        return res.status(200).json(response)
        
    } catch(e){
        return res.status(404).json({
            message:e
        })
    }
}
const logoutUser = async(req ,res)=>{
    try{
        res.clearCookie('refresh_token')
        return res.status(200).json({
            status:'OK',
            message:'Logout successfully'
        })
        
    } catch(e){
        return res.status(404).json({
            message:e
        })
    }
}


module.exports ={
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    refreshToken,
    logoutUser,
    deleteMany,
}