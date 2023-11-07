import httpStatus from "http-status";
import ErrorHandles from "../utils/error.js";
import { updateUser, findUserByID } from "../services/userService.js";
import addressSchema from "../models/addressModel.js";
import imageSchema from "../models/imageModel.js";
import { nanoid } from "nanoid";
import Tokens from "../utils/token.js";
import { createSellerService } from "../services/sellerServices.js";
import { userType } from "../utils/constants.js";


const addToBucket = async (req, res, next) => {
  try {
    const userID = req?.user?._id;
    const userBuket = req?.user?.bucket;
    const { productID, to } = req.query;
    const { quantity } = req.body;
    let updateQuery;
    const fieldToPush = `bucket.${to}`;

    if (
      to === "saveMe" &&
      Array.isArray(userBuket.saveMe) &&
      userBuket.saveMe.length > 0
    ) {
      const saveMeArr = userBuket.saveMe.map((ele) => ele._id.toString());
      const saveMeSet = new Set(saveMeArr);
      if (!saveMeSet.has(productID.toString())) {
        updateQuery = {
          $push: {
            [fieldToPush]: productID,
          },
        };
      } else {
        return next(new ErrorHandles("Product already in saveMe.", 400));
      }
    } else if (to === "saveMe") {
      updateQuery = {
        $push: {
          [fieldToPush]: productID,
        },
      };
    }

    if (
      to === "card" &&
      Array.isArray(userBuket.card) &&
      userBuket.card.length > 0
    ) {
      const cardArr = userBuket.card.map((ele) => ele.product._id.toString());
      const cardSet = new Set(cardArr);
      if (!cardSet.has(productID.toString())) {
        updateQuery = {
          $push: {
            [fieldToPush]: {
              product: productID,
              qlt: quantity || 1,
            },
          },
        };
      } else {
        const arrindx = cardArr.findIndex(
          (ele) => ele === productID.toString()
        );
        const fieldToUpdate = `bucket.${to}.${arrindx}.qlt`;
        updateQuery = {
          $inc: {
            [fieldToUpdate]: quantity || 1,
          },
        };
      }
    } else if (to === "card") {
      updateQuery = {
        $push: {
          [fieldToPush]: {
            product: productID,
            qlt: quantity || 1,
          },
        },
      };
    }
    updateUser({ _id: userID }, updateQuery, (err, result) => {
      if (!err) {
        return res.status(httpStatus.OK).json(result);
      } else {
        return next(new ErrorHandles(err?.message, 400));
      }
    });
  } catch (error) {
    return next(new ErrorHandles(error?.message, 400));
  }
};

// test remain
const addaddress = async (req, res, next) => {
  try {
    const userID = req?.user?._id;
    const { address, city, state, country, pincode } = req.body;

    if (!address || !city || !state || !country || !pincode) {
      return next(new ErrorHandles("All fields are required", 400));
    } else {
      const address = new addressSchema({
        address,
        city,
        state,
        country,
        pincode,
      });
      // validator
      // address.

      const updateQuery = {
        $push: {
          address,
        },
      };
      await updateUser({ _id: userID }, updateQuery, (err, result) => {
        if (!err) {
          return res.status(httpStatus.OK).json(result);
        } else {
          return next(new ErrorHandles(err?.message, 400));
        }
      });
    }
  } catch (error) {
    return next(new ErrorHandles(error?.message, 400));
  }
};

// test remain
const updateAddress = async (req, res, next) => {
  // form =  address
  // where = index of arr
  try {
    const userID = req?.user?._id;
    const { where } = req.query;
    const { address, city, state, country, pincode } = req.body;
    const UserExist = await findUserByID({ _id: userID });
    if (UserExist.success) {
      const user = UserExist?.user;
      if (Array.isArray(user.address) && user.address.length > 0) {
        if (!address || !city || !state || !country || !pincode) {
          new ErrorHandles(
            `please Enter the ${
              (!address && "address") ||
              (!city && "city") ||
              (!state && "state") ||
              (!country && "country") ||
              (!pincode && "pincode")
            }`,
            400
          );
        } else {
          const address = new addressSchema({
            address,
            city,
            state,
            country,
            pincode,
          });
          user.address[where] = address;
        }
      } else {
        return next(new ErrorHandles("Invalid operation or data", 400));
      }

      await user.save({ validateBeforeSave: false });
      return res.status(httpStatus.OK).json({
        success: true,
        user,
      });
    } else {
      return next(new ErrorHandles(UserExist?.message, 400));
    }
  } catch (error) {
    return next(new ErrorHandles(error?.message, 400));
  }
};

const deleteUserArrData = async (req, res, next) => {
  // form = saveMe or card or address
  // where = index of arr
  try {
    const userID = req?.user?._id;
    const { from, where } = req.query;

    const UserExist = await findUserByID({ _id: userID });
    if (UserExist.success) {
      const user = UserExist?.user;

      if (from === "saveMe" && Array.isArray(user.bucket.saveMe)) {
        user.bucket.saveMe.splice(where, 1);
      } else if (from === "card" && user.bucket.card) {
        user.bucket.card.splice(where, 1);
      } else if (from === "address" && user.address) {
        user.address.splice(where, 1);
      } else {
        return next(new ErrorHandles("Invalid operation or data", 400));
      }

      await user.save({ validateBeforeSave: false });
      return res.status(httpStatus.OK).json({
        success: true,
        user,
      });
    } else {
      return next(new ErrorHandles(UserExist?.message, 400));
    }
  } catch (error) {
    return next(new ErrorHandles(error?.message, 400));
  }
};

// test remain
const updateUserProfile = async (req, res, next)  => {
  try {
    const userID = req.user._id;
    const { image_base64, name, email } = req.body;
    let updateQuery = {};

    if (updateQuery) {
      const img = imageSchema({
        public_id: nanoid(),
        url: image_base64,
      });
      updateQuery["avatar"] = img;
    }

    if (name) {
      updateQuery["name"] = name;
    }

    if (email) {
      updateQuery["email"] = email;
    }

    await updateUser({ _id: userID }, updateQuery, (err, result) => {
      if (!err) {
        return res.status(httpStatus.OK).json(result);
      } else {
        return next(new ErrorHandles(err?.message, 400));
      }
    });
  } catch (error) {
    return next(new ErrorHandles(error?.message, 400));
  }
};

const changePassword = async (req, res, next)  => {
  try {
    const user = req?.user;
    const {oldPassword , newPassword} = req.body
    console.log("changePassword",oldPassword , newPassword)
    const isValid  = await user.isCorrectPassword(oldPassword)

    if(isValid){
      user.password = newPassword
      await user.save()
      const token = new Tokens();
      const result = token.sendToken(user); 
      res.cookie("token", result?.token, result?.option);
      return res.status(httpStatus.OK).json(result);
    }else{
      return next(new ErrorHandles('Old password does not match', 400));
    }

  } catch (error) {
    return next(new ErrorHandles(error?.message, 400));
  }
};

const assignUserRole = async (req, res, next) => {
  try {
    const userID = req.user._id;
    const { totalStock } = req.body;
    await updateUser(
      { _id: userID },
      { role: userType.SELLER },
      (err, result) => {
        if (!err) {
          const userData = result?.user;
          createSellerService(
            { userID: userData?._id, totalStock },
            (err, result) => {
              if (!err) {
                return res.status(httpStatus.OK).json({
                  success: true,
                  user: userData,
                  seller : result?.seller
                });
              } else {
                return next(
                  new ErrorHandles(err?.message, httpStatus.BAD_REQUES)
                );
              }
            }
          );
        } else {
          return next(new ErrorHandles(err?.message, httpStatus.BAD_REQUES));
        }
      }
    );
  } catch (error) {
    return next(new ErrorHandles(error?.message, httpStatus.BAD_REQUES));
  }
};



export {
  addToBucket,
  addaddress,
  deleteUserArrData,
  updateAddress,
  updateUserProfile,
  changePassword,
  assignUserRole
};
