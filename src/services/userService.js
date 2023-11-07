import userModel from "../models/userModel.js";
import { modelsName } from "../utils/constants.js";
const updateUser = async (filter, query, callback) => {
  try {
    const updatedUser = await userModel
      .findOneAndUpdate(filter, query, {
        new: true,
        runValidators: true,
      })
      .populate([
        {
          path: "bucket.card.product",
          model: modelsName.PRODUCTS,
        },
        {
          path: "bucket.saveMe",
          model: modelsName.PRODUCTS,
        },
      ]);
    if (updatedUser) {
      return callback(false, { success: true, user: updatedUser });
    } else {
      return callback({ success: false, message: "User Not Found" });
    }
  } catch (error) {
    return callback({
      success: false,
      message: error?.message,
    });
  }
};

//  findUserByField
const findUserByField = async (filter) => {
  try {
    const user = await userModel.findOne(filter).populate([
      {
        path: "bucket.card.product",
        model: modelsName.PRODUCTS,
      },
      {
        path: "bucket.saveMe",
        model: modelsName.PRODUCTS,
      },
    ]);
    if (user) {
      return { success: true, user };
    } else {
      return { success: false, message: "User Not Found" };
    }
  } catch (error) {
    return {
      success: false,
      message: error?.message,
    };
  }
};

const findUserByID = async (filter) => {
  try {
    const user = await userModel.findById(filter).populate([
      {
        path: "bucket.card.product",
        model: modelsName.PRODUCTS,
      },
      {
        path: "bucket.saveMe",
        model: modelsName.PRODUCTS,
      },
    ]);

    if (user) {
      return { success: true, user };
    } else {
      return { success: false, message: "User Not Found" };
    }
  } catch (error) {
    return {
      success: false,
      message: error?.message,
    };
  }
};

export { updateUser, findUserByField, findUserByID };
