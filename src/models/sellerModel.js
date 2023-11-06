import mongoose from "mongoose";
import { modelsName } from "../utils/constants.js";

const sellerSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: modelsName.USERS,
      unique: true,
      required: true,
    },
    totalproduct: {
      type: Number,
      default: 0,
    },
    totalStock: {
      type: Number,
      required: [true, "Please specify Number of products you can store"],
    },
    usedStock: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    totalRating: {
      type: Number,
      default: 0,
    },
    totalbanned: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model(modelsName.SELLERS, sellerSchema);
