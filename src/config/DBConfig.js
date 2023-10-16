const mongoose =  require("mongoose")

const getDBURI = () =>{
    return process.env.ENVIROMENT === "development" ? process.env.DEV_DB_URI : process.env.PROD_DB_URI 
}

const DBConnection = () =>{
    mongoose.connect(getDBURI() , {
        useNewUrlParser:true,
        useUnifiedTopology:true}).then((data)=>{
        console.log(`... MongoDB is connnected with server ${data.connection.host}...`)
    }).catch((err)=>{
        console.log(`... MongoDB is not connected and the error is : ${err} ...`)
    })
}  

module.exports = DBConnection