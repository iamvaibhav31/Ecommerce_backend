import userModel from "../models/userModel.js";
import { nanoid } from "nanoid";
import Tokens from "../utils/token.js";

const createNewUserService = async (params) => {
  try {
    const { avatar_url, name, email, password } = params;

    const user = new userModel({
      name,
      avatar: {
        public_id: nanoid(),
        url: avatar_url,
      },
      email,
      password,
    });

    await user.save();
    const token = new Tokens()
    return token.sendToken(user);

  } catch (err) {
    return {
      success: false,
      message: err?.message,
    };
  }
};

const userLoginService = async (params, callback) => {
  try {
    const { email, password, userDetails } = params;
    
    const passwordValid = await userDetails.isCorrectPassword(password);

    if (passwordValid) {
      const token = new Tokens()
      return callback(false, token.sendToken(userDetails));
    } else {
      return callback({
        success: false,
        message: "Invalid Credentials",
      });
    }
  } catch (err) {
    return callback({
      success: false,
      message: err?.message,
    });
  }
};

const isUserExist = async (params) => {
  try {
    const { email } = params;

    const user = await userModel.findOne({ email });

    if (user) {
      return { success: true, user };
    } else {
      return { success: false, message: "Invalid Credentials" };
    }
  } catch (err) {
    return {
      success: false,
      message: err?.message,
    };
  }
};

export { createNewUserService, userLoginService, isUserExist };
