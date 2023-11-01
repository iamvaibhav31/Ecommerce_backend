import mongoose from "mongoose";
import { modelsName, userType } from "../utils/constants.js";
import validator from "validator";
import imageSchema from "./imageModel.js";
import Encryption from "../utils/encrypt.js";
import Tokens from "../utils/token.js"; 

const userSchema = new mongoose.Schema({
  avatar: imageSchema,
  name: {
    type: String,
    required: [true, "Please Enter your name"],
  },
  role: {
    type: String,
    default: userType.USER,
  },
  email: {
    type: String,
    required: [true, "Please Enter your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a Valid Email id"],
  },
  password: {
    type: String,
    required: [true, "Please Enter your Password"],
    minLength: [8, "Your password should be between 8 - 16 character"],
    maxLength: [16, "Your password should be between 8 - 16 character"],
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,

  isSeller:{
    type: Boolean,
    default: false,
  },
  isAdmin:{
    type: Boolean,
    default: false,
  }
});

userSchema.pre("save", async function (next) {
  const hashing = new Encryption();
  if (!this.isModified("password")) {
    next();
  } else {
    this.password = await hashing.encrypt(this.password);
  }
});

userSchema.methods.getJwtToken = function () {
  const token = new Tokens()
  return token.genrateToken({
    email: this.email
  });
};

userSchema.methods.isCorrectPassword = function (password) {
  const hashing = new Encryption();
  return hashing.validation(password, this.password);
};

export default mongoose.model(modelsName.USERS, userSchema);
