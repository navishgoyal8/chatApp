const UserModel = require('../models/UserModel');
const bcrypt = require('bcryptjs');

const registerUser = async(req,res) => {

try{
    const {name,email,password,profile_pic} = req.body;

    const checkEmail = await UserModel.findOne({email: email})

    if(checkEmail){
        return res.status(400).json({
            message: "Already User exists!",
            error: true
        })
    }

    // CONVERTING THE PASSWORD INTO HASH
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password,salt);

    const payload = {
        name,
        email,
        profile_pic,
        password: hashPassword
    }

    const user = new UserModel(payload)
    const userSave = await user.save();

    return res.json({
        message: "User Registered Successfully!",
        success: true,
        data: userSave
    })
    
    }
    catch(error){
        return res.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}

module.exports = registerUser;