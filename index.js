const express = require("express")
require('dotenv').config()
const server = express()

const DBConfig = require("./src/config/DBConfig")

DBConfig()

server.listen(process.env.PORT,()=>{
    console.log("... Server is started ...")
})