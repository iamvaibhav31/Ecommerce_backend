const mongoose = require("mongoose")
const {modelsName}  = require("./../constant/models")

const reviewModules = mongoose.Schema({
    product_id:{type: mongoose.Types.ObjectId, ref:modelsName.PRODUCTS},
    name:{
        type:String,
        required:true,
    },
    rating:{
        type:Number,
        required:true,
    },
    comment:{
        type:String,
        required:true,
    }
})

module.export = mongoose.model(modelsName.REVIEWS,reviewModules)