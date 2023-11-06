import httpStatus from "http-status";
import ErrorHandles from "../utils/error.js";
import { updateUser, isUserExist } from "../services/userService.js";
import addressSchema from "../models/addressModel.js";

const addToBucket = async (req, res, next) => {
  try {
    const userEmail = req?.user?.email;
    const { productID, to } = req.query;
    const { quantity } = req.body;

    const fieldToPush = `bucket.${to}`;

    const updateQuery = {
      $push: {
        [fieldToPush]:
          to === "saveMe"
            ? { product: productID }
            : {
                product: productID,
                qlt: quantity || 1,
              },
      },
    };
    updateUser({ email: userEmail }, updateQuery, (err, result) => {
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

const deleteUserArrData = async (req, res, next) => {
  // form = saveMe or card or address
  // where = index of arr
  try {
    const userEmail = req?.user?.email;
    const { from, where } = req.params;

    const UserExist = await isUserExist({ email: userEmail });
    if (UserExist.success) {
      const user = UserExist?.user;

      if (from === "saveMe" && user.bucket.saveMe) {
        user.bucket.saveMe.splice(where, 1);
      } else if (from === "card" && user.bucket.card) {
        user.bucket.card.splice(where, 1);
      } else if (from === "address" && user.address) {
        user.address.splice(where, 1);
      } else {
        return next(new ErrorHandles("Invalid operation or data", 400));
      }

      await user.save();
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

const updateUserArrData = async (req, res, next) => {
  // form =  card or address
  // where = index of arr
  try {
    const userEmail = req?.user?.email;
    const { from, where } = req.params;
    const { quantity, address, city, state, country, pincode } = req.body;
    const UserExist = await isUserExist({ email: userEmail });
    if (UserExist.success) {
      const user = UserExist?.user;
      if (from === "card" && user.bucket.card) {
        if (!quantity) {
          return next(
            new ErrorHandles("Please Enter the quantity of the product", 400)
          );
        } else {
          user.bucket.card[where].qlt = quantity;
        }
      } else if (from === "address" && user.address) {
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

      await user.save();
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
const addaddress = async (req, res, next) => {
  try {
    const userEmail = req?.user?.email;
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

      //   address.val

      const updateQuery = {
        $push: {
          address,
        },
      };
      updateUser({ email: userEmail }, updateQuery, (err, result) => {
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

export { addToBucket, addaddress, deleteUserArrData , updateUserArrData };
