import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductDetails,
  updateProducts,
  deleteProducts,
} from "../../controller/productController.js";
import { onlyaccessBy , isAuthenticated , isAccessable} from "../../middleware/authMiddleware.js";
import { userType } from "../../utils/constants.js";
const productRoutes = Router();

productRoutes.get(
  "/allProducts",
  isAuthenticated,
  onlyaccessBy.bind([userType.USER, userType.SELLER, userType.ADMIN]),
  isAccessable,
  getAllProducts
);

productRoutes.post(
  "/createProducts",
  onlyaccessBy.bind([userType.SELLER]),
   isAccessable,
  createProduct
);

productRoutes.get(
  "/ProductDetails",
  onlyaccessBy.bind([userType.USER, userType.SELLER, userType.ADMIN]),
   isAccessable,
  getProductDetails
);

productRoutes.patch(
  "/updatePoducts",
  onlyaccessBy.bind([userType.SELLER]),
   isAccessable,
  updateProducts
);

productRoutes.delete(
  "/deletePoducts",
  onlyaccessBy.bind([userType.SELLER , userType.ADMIN]),
   isAccessable,
  deleteProducts
);

export default productRoutes;
