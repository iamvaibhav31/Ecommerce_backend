import {
  createProductService,
  getAllProductsServices,
  deleteProductService,
  updateProdctService,
  isProductExist,
} from "../services/productServices.js";

import ErrorHandles from "../utils/error.js";

import httpStatus from "http-status";

const getAllProducts = async (req, res, next) => {
  try {
    await getAllProductsServices(req.query, (err, result) => {
      if (err) {
        return next(new ErrorHandles(err?.message, httpStatus.BAD_REQUES));
      } else {
        return res.status(httpStatus.OK).json(result);
      }
    });
  } catch (error) {
    return next(new ErrorHandles(error?.message, httpStatus.BAD_REQUES));
  }
};

const createProduct = async (req, res, next) => {
  try {
    const created = await createProductService(req.body);

    if (created?.success) {
      return res.status(httpStatus.CREATED).json(result);
    } else {
      return next(new ErrorHandles(created?.message, 400));
    }
  } catch (error) {
    return next(new ErrorHandles(error?.message, 400));
  }
};

const getProductDetails = async (req, res, next) => {
  try {
    const isExist = await isProductExist(req.query);
    if (isExist?.success) {
      res.status(httpStatus.OK).json(isExist);
    } else {
      return next(new ErrorHandles(isExist?.message, 400));
    }
  } catch (error) {
    return next(new ErrorHandles(error?.message, 400));
  }
};

const updateProducts = async (req, res, next) => {
  try {
    const result = await isProductExist(req.query);

    if (result?.success) {
      await updateProdctService(
        { ...req.body, ...req.query, productDetails: result?.product },
        (err, result) => {
          if (err) {
            return next(new ErrorHandles(err?.message, 400));
          } else {
            return res.status(httpStatus.OK).json(result);
          }
        }
      );
    } else {
      return next(new ErrorHandles(result?.message, 400));
    }
  } catch (error) {
    return next(new ErrorHandles(error?.message, 400));
  }
};

const deleteProducts = async (req, res, next) => {
  try {
    const result = await isProductExist(req.query);

    if (result?.success) {
      await deleteProductService(req.query, (err, result) => {
        if (err) {
          return next(new ErrorHandles(err?.message, 400));
        } else {
          return res.status(httpStatus.OK).json(result);
        }
      });
    } else {
      return next(new ErrorHandles(result?.message, 400));
    }
  } catch (error) {
    return next(new ErrorHandles(error?.message, 400));
  }
};

export {
  getAllProducts,
  createProduct,
  getProductDetails,
  updateProducts,
  deleteProducts,
};
