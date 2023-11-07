import mongoose from "mongoose";
import { modelsName } from "../utils/constants.js";

const bucketSchema = new mongoose.Schema(
  {
    saveMe: [
      {
        type: mongoose.Schema.ObjectId,
        ref: modelsName.PRODUCTS,
      }
    ],
    card: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: modelsName.PRODUCTS,
        },
        qlt: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  { _id: false }
);

export default bucketSchema;
