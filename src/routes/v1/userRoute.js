import { Router } from "express";
import {
  onlyaccessBy,
  isAuthenticated,
  isAccessable,
} from "../../middleware/authMiddleware.js";
import { addToBucket ,addaddress , deleteUserArrData , updateUserArrData } from "../../controller/userController.js";
import { userType } from "../../utils/constants.js";

const userRoutes = Router();

userRoutes.post(
  "/addToBucket",
  isAuthenticated,
  onlyaccessBy.bind([userType.USER, userType.SELLER, userType.ADMIN]),
  isAccessable,
  addToBucket
);


userRoutes.post(
  "/addaddress",
  isAuthenticated,
  onlyaccessBy.bind([userType.USER, userType.SELLER, userType.ADMIN]),
  isAccessable,
  addaddress
);



userRoutes.delete(
  "/deleteUserArrData",
  isAuthenticated,
  onlyaccessBy.bind([userType.USER, userType.SELLER, userType.ADMIN]),
  isAccessable,
  deleteUserArrData
);

export default userRoutes;
