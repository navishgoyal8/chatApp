const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGODB_URI)

        const connection = mongoose.connection

        connection.on('connected',() => {
            console.log('Connected to DB');
        })

        connection.on('error',(error) => {
            console.log('Something is wrong here',error)
        })
    }
    catch(error){
        console.log('Something is wrong',error)
    }
}

module.exports = connectDB;