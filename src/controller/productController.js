import {
  createProductService,
  getAllProductsServices,
  deleteProductService,
  updateProdctService,
  isProductExist,
  isProductYours,
} from "../services/productServices.js";
import { nanoid } from "nanoid";
import ErrorHandles from "../utils/error.js";

import httpStatus from "http-status";

const getAllProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, name, sellerId, category, price , rating} = req.query;
    let skip = (Number(page) - 1) * limit;
    let query = {};

    if (name) {
      query["name"] = { $regex: `${name}`, $options: "i" };
    }

    if (category) {
      const parsedCategories = JSON.parse(category);
      query["category"] = { $in: parsedCategories };
    }

    if (price) {
      const priceQuery = {};
      if (price["$gt"]) {
        priceQuery["$gt"] = parseFloat(price["$gt"]);
      }
      if (price["$lt"]) {
        priceQuery["$lt"] = parseFloat(price["$lt"]);
      }
      if (price["$gte"]) {
        priceQuery["$gte"] = parseFloat(price["$gte"]);
      }
      if (price["$lte"]) {
        priceQuery["$lte"] = parseFloat(price["$lte"]);
      }
      query["price"] = { ...priceQuery };
    }

    await getAllProductsServices(
      { page, limit, skip, query },
      (err, result) => {
        if (err) {
          return next(new ErrorHandles(err?.message, httpStatus.BAD_REQUES));
        } else {
          return res.status(httpStatus.OK).json(result);
        }
      }
    );
  } catch (error) {
    return next(new ErrorHandles(error?.message, httpStatus.BAD_REQUES));
  }
};

const createProduct = async (req, res, next) => {
  try {
    req.body.id = req.user._id;
    const created = await createProductService(req.body);

    if (created?.success) {
      return res.status(httpStatus.CREATED).json(created);
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

    const { id } = req.query;
    const { name, description, price, rating, images_urls, category, stock } =
      req.body;
    let filter = {};
    let updateQuery = {};

    if (id) {
      filter["_id"] = id;
    }
    if (name) {
      updateQuery["name"] = name;
    }
    if (description) {
      updateQuery["description"] = description;
    }
    if (price) {
      updateQuery["price"] = price;
    }

    if (rating) {
      updateQuery["rating"] = rating;
    }
    if (stock) {
      updateQuery["stock"] = stock;
    }

    if (images_urls) {
      const productImage = images_urls?.map((url) => {
        return {
          public_id: nanoid(),
          url: url,
        };
      });
      updateQuery["$push"] = { images: { $each: productImage } };
    }

    if (category) {
      updateQuery["$push"] = { ...updateQuery["$push"] ,category: { $each: category } };
    }

    if (result?.success) {
      const isYours = isProductYours({
        userId: req.user._id,
        productDetails: result?.product,
      });

      if (isYours?.success) {
        await updateProdctService({ filter, updateQuery }, (err, result) => {
          if (err) {
            return next(new ErrorHandles(err?.message, 400));
          } else {
            return res.status(httpStatus.OK).json(result);
          }
        });
      } else {
        return next(new ErrorHandles(isYours?.message, 403));
      }
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
      const isYours = isProductYours({
        userId: req.user._id,
        productDetails: result?.product,
      });
      if (isYours?.success) {
        await deleteProductService(req.query, (err, result) => {
          if (err) {
            return next(new ErrorHandles(err?.message, 400));
          } else {
            return res.status(httpStatus.OK).json(result);
          }
        });
      } else {
        return next(new ErrorHandles(isYours?.message, 403));
      }
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
