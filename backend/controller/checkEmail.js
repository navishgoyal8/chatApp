const UserModel = require('../models/UserModel');

const checkEmail = async(req,res) => {
    try{
        const {email} = req.body
        const checkForEmail = await UserModel.findOne({email: email}).select("-password")
        if(!checkForEmail){
            return res.status(400).json({
                message: "Email not found",
                error: true
            })
        }

        return res.status(200).json({
            message: "email verify",
            data: checkForEmail,
            success: true
        })

    }
    catch(error){
        return res.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}

module.exports = checkEmail;