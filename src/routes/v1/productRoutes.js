import { Router} from "express";
import { createProduct , getAllProducts } from "../../controller/productController.js";

const productRoutes = Router()

productRoutes.get("/allProducts",getAllProducts)
productRoutes.post("/createProducts",createProduct)


export default productRoutes