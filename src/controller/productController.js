import { createProductService } from "../services/productServices.js";
import httpStatus from "http-status";

const getAllProducts = async (req, res, next) => {
        
};

const createProduct = async (req, res, next) => {
  try {
    await createProductService(req.body, (err, result) => {
      if (err) {
        return res.status(httpStatus.BAD_REQUEST).json(err);
      }
      return res.status(httpStatus.CREATED).json(result);
    });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({
      status: false,
      message: error?.message || "Something went wrong",
    });
  }
};

export { getAllProducts, createProduct };
