import express from "express";
import productRoutes from './v1/productRoutes.js'
import authRoutes from "./v1/authRoutes.js";
import reviewRoutes from "./v1/reviewRoutes.js";
import sellerRoutes from "./v1/sellerRoutes.js";
import userRoutes from "./v1/userRoute.js";
const routes = express.Router()

routes.use("/v1" ,productRoutes)
routes.use("/v1" ,authRoutes)
routes.use("/v1" ,reviewRoutes)
routes.use("/v1" ,sellerRoutes)
routes.use("/v1", userRoutes);

export default routes