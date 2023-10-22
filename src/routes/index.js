import express from "express";
import productRoutes from './v1/productRoutes.js'

const routes = express.Router()

routes.use("/v1" ,productRoutes)

export default routes