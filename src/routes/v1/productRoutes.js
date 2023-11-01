import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductDetails,
  updateProducts,
  deleteProducts,
} from "../../controller/productController.js";
import { accessByUserType } from "../../middleware/access.js";
import { userType } from "../../helper/constants.js";
const productRoutes = Router();

productRoutes.get("/allProducts", getAllProducts);

productRoutes.post(
  "/createProducts",
  accessByUserType.bind([userType.SELLERS, userType.ADMIN]),
  createProduct
);

productRoutes.get("/ProductDetails", getProductDetails);

productRoutes.patch(
  "/updatePoducts",
  accessByUserType.bind([userType.SELLERS, userType.ADMIN]),
  updateProducts
);

productRoutes.delete(
  "/deletePoducts",
  accessByUserType.bind([userType.SELLERS, userType.ADMIN]),
  deleteProducts
);

export default productRoutes;
