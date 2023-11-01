import express from "express";
import productRoutes from './v1/productRoutes.js'
import usersRoutes from "./v1/UserRoutes.js";
const routes = express.Router()

routes.use("/v1" ,productRoutes)
routes.use("/v1" ,usersRoutes)

export default routes