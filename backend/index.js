require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
// const app = express();
const connectDB = require('./config/connectDB');
const router = require('./routes/index');
const {app,server} = require('./socket/index');

app.use(express.json());
app.use(cors(
    {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }

));
app.use(cookieParser());
app.use('/api',router);


const PORT = 8080

app.get('/',(req,res) => {
    res.json('Hello');
})

connectDB().then(() => {

    server.listen(PORT,() => {
    console.log(`Server running at port ${PORT}:`)
})

})

