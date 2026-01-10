require("dotenv").config(); // Call it before the EXPRESS LOADS
const express = require('express');
const app = express(); //http Node module
const PORT = process.env.PORT || 3000;

app.use(express.json()); // so to read req.body when json is parsed in body

const apiGateways = require('./routes/apiGateways'); // middleware
app.use('/api', apiGateways);  // always use "use" middleware for api routes

app.get('/',(req,res)=>{ // for localhost:3000/
res.send(`Hello World`)
})

app.listen(PORT,()=>{ // for port hear
    console.log(`Listening on port  ${PORT}`)
})

const connection = require('./config/connection'); // for DB connection
connection()