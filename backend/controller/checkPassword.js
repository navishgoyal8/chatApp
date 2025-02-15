const UserModel = require("../models/UserModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const checkPassword = async(req,res) => {
    try{
        const {password,userId} = req.body
        const user = await UserModel.findById(userId)

        const value = await bcrypt.compare(password, user.password); 
        if(!value){
             return res.status(400).json({
                message: "Please check password",
                error: true
        })
        }

        const tokenData = {
            userId: user._id,
            email: user.email
        }
        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {expiresIn: '1d'})

        const cookieOptions = {
            httpOnly: true,  // Prevents client-side JavaScript access
            secure: process.env.NODE_ENV === 'production',  // Only secure in production
            sameSite: 'None',  // Important for cross-origin cookies
            domain: '.onrender.com',  // Adjust based on your frontend & backend domains
        }
    
    return res.cookie('token',token,cookieOptions).status(200).json({
                message: "Login Successfully",
                token: token,
                success: true
            })
}
    catch(error) {
        return res.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}

module.exports = checkPassword;