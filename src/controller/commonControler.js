import httpStatus from "http-status";
import ErrorHandles from "../utils/error.js";
import { updateUser } from "../services/userService.js";
import { createSellerService } from "../services/sellerServices.js";
import { userType } from "../utils/constants.js";
// user role change api

const assignUserRole = async (req, res, next) => {
  try {
    const userEmail = req.user.email;
    const { totalStock } = req.body;
    await updateUser(
      { email: userEmail },
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
                  message: "Successfully Assigned Seller Role",
                });
              } else {
                return next(
                  new ErrorHandles(
                    "Error in Assign role seller",
                    httpStatus.BAD_REQUES
                  )
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

export { assignUserRole };
