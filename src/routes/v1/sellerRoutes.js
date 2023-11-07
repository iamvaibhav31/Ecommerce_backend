import { Router } from "express";
import {
  onlyaccessBy,
  isAuthenticated,
  isAccessable,
} from "../../middleware/authMiddleware.js";
import { userType } from "../../utils/constants.js";
const sellerRoutes = Router();


const hideProduct = () => {}

export default sellerRoutes;
