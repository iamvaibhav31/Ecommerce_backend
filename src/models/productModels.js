import mongoose from "mongoose";
import { modelsName } from "../utils/constants.js";
import imageSchema from "./imageModel.js";
import { calculateOverallRating } from "../utils/rating.js";
import ErrorHandles from "../utils/error.js";

const productSchema = new mongoose.Schema(
  {
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
    totalRating: {
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
    created_by: {
      type: mongoose.Schema.ObjectId,
      ref: modelsName.USERS,
    },
    isHide: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

productSchema.post("findOneAndUpdate", async function (doc, next) {
  const update = this.getUpdate();
  const isNumOfReviewsModified =
    update.hasOwnProperty("$inc") && update["$inc"].numOfReviews;
  const isTotalRatingModified =
    update.hasOwnProperty("$inc") && update["$inc"].totalRating;
  if (isNumOfReviewsModified && isTotalRatingModified) {
    try {
      doc.rating = calculateOverallRating(doc.totalRating, doc.numOfReviews);
      await doc.save();
      next();
    } catch (error) {
      return next(new ErrorHandles(error?.message, 400));
    }
  } else {
    next();
  }
});

export default mongoose.model(modelsName.PRODUCTS, productSchema);
