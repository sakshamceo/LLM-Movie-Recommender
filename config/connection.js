const mongoose = require('mongoose')

const connect = async ()=>{ // async function to connect with database
    try{
        await mongoose.connect(process.env.dbUri); // Promise with connecting database connection string 
        console.log('connected with databse')
    }
    catch(err){
        console.error(`Its throwing error ${err}`)
    }
}
module.exports = connect;