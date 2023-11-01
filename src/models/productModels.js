import mongoose from "mongoose";
import { modelsName } from "../utils/constants.js";
import imageSchema from "./imageModel.js";


const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name"],
  },
  description: {
    type: String,
    required: [true, "Please enter a description for the product"],
  },
  price: {
    type: Number,
    required: [true, "Please enter the product price"],
  },
  rating: {
    type: Number,
    default: 0,
  },
  images: [imageSchema],
  category: {
    type: Array,
    required: [true, "Please enter a category for the product"],
  },
  stock: {
    type: Number,
    required: [true, "Please enter the stock present"],
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

productSchema.index({
  category: 1,
  name: "text",
});

export default mongoose.model(modelsName.PRODUCTS, productSchema);
