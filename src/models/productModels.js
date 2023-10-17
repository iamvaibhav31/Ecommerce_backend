const mongoose = require("mongoose")
const {modelsName}  = require("./../constant/models")

const productSchema = mongoose.Schema({
    name:{
        type : String,
        required:[true,"Please enter product name"]
    },
    description:{
        type:String,
        required:[true,"Please enter a description for the product"],
    },
    price:{
        type:Number,
        required:[true,"Please enter the product price"]
    },
    rating:{
        type:Number,
        default:0,
    },
    images:[{
        public_1d:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true
        }
    }],
    category:{
        type:String,
        required:[true,"Please enter a category for the product"],
    },
    stock:{
        type:Number,
        required:[true,"Please enter the stock present"],
        maxLength:[4,"stock cannot exceed 4 characters"],
        default:1,
    },
    numOfReviews:{
        type:String,
        default:0
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

module.exports = mongoose.model(modelsName.PRODUCTS , productSchema)