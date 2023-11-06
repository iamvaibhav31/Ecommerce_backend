import userModel from "../models/userModel.js";

const updateUser = async (filter, query, callback) => {
  try {
    const updatedUser = await userModel.findOneAndUpdate(filter, query, {
      new: true,
      runValidators: true,
    });
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

const isUserExist = async (filter) => {
  try {
    const user = await userModel.findOne(filter);
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

export { updateUser, isUserExist };
