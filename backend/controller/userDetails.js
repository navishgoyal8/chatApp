const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");


const userDetails = async(req,res) => {
    try{
        const token = req.cookies.token || ""

        const user = await getUserDetailsFromToken(token)

        return res.status(200).json({
            message: "user details",
            data: user
        })

    }
    catch(error){
        return res.json({
            message: error.message || error,
            error: true
        })
    }   
}

module.exports = userDetails;