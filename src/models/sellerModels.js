import mongoose from "mongoose";
import { modelsName } from "../utils/constants.js";

const sellerSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: modelsName.USERS,
    unique: true,
  },
  totalproduct: {
    type: Number,
  },
  totalStock: {
    type: Number,
  },
  remainingStock: {
    type: Number,
  },
  rating: {
    type: Number,
  },
  totalbanned: {
    type: Number,
  },
});

export default mongoose.model(modelsName.SELLERS, sellerSchema);

