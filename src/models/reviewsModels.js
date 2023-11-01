import mongoose from "mongoose"
import {modelsName} from "../helper/constants.js"

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

export default mongoose.model(modelsName.REVIEWS,reviewModules)