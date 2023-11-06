import { Router } from "express";
import {
  onlyaccessBy,
  isAuthenticated,
  isAccessable,
} from "../../middleware/authMiddleware.js";
import { userType } from "../../utils/constants.js";
import { assignUserRole } from "../../controller/commonControler.js";

const sellerRoutes = Router();

sellerRoutes.post(
  "/assignUserRole",
  isAuthenticated,
  onlyaccessBy.bind([userType.USER]),
  isAccessable,
  assignUserRole
);

export default sellerRoutes;
