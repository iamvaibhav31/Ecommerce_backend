import mongoose from "mongoose";
import { modelsName } from "../helper/constants.js";

const imageSchema = mongoose.Schema({
  public_id: {
    type: String,
    unique: true,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  _id: false, 
});

const productSchema = mongoose.Schema({
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
    maxLength: [4, "stock cannot exceed 4 characters"],
    default: 1,
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
