import productModels from "../models/productModels.js";
import { nanoid } from "nanoid";

const getAllProductsServices = async (params, callback) => {
  try {
    const { page, limit, skip, query } = params;

    let products = await productModels
      .find(query)
      .skip(skip)
      .limit(Number(limit));

    const totalCount = await productModels.count();

    return callback(false, {
      success: true,
      products,
      page: Number(page),
      pages: Math.ceil(totalCount / limit),
      limit: Number(limit),
      totalCount,
    });
  } catch (error) {
    return callback({
      success: false,
      message: error?.message,
    });
  }
};

const createProductService = async (params, callback) => {
  try {
    const {
      name,
      description,
      price,
      rating,
      images_urls,
      category,
      stock,
      id,
    } = params;

    const productImage = images_urls?.map((url) => {
      return {
        public_id: nanoid(),
        url: url,
      };
    });

    const product = new productModels({
      name,
      description,
      price,
      rating,
      images: [...(productImage || [])],
      category,
      stock,
      created_by: id,
    });

    await product.save();

    return {
      success: true,
      product,
    };
  } catch (error) {
    return {
      success: false,
      message: error?.message,
    };
  }
};

const deleteProductService = async (params, callback) => {
  try {
    const { id } = params;

    await productModels.deleteOne({ _id: id });

    return callback(false, {
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    return callback({
      success: false,
      message: error?.message,
    });
  }
};

const updateProdctService = async (params, callback) => {
  try {
    const { filter, updateQuery } = params;
    const product = await productModels.findOneAndUpdate(filter, updateQuery, {
      new: true, // Return the modified document
      runValidators: true, // Run validators for update operation
    });
    return callback(false, {
      success: true,
      product,
    });
  } catch (error) {
    return callback({
      success: false,
      message: error?.message,
    });
  }
};

const isProductExist = async (params) => {
  try {
    const { id } = params;

    const product = await productModels.findById(id);

    if (!product) {
      return {
        success: false,
        message: "No Product Found",
      };
    } else {
      return {
        success: true,
        product,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error?.message,
    };
  }
};

const isProductYours = (params) => {
  try {
    const { userId, productDetails } = params;

    if (userId?.toString() === productDetails?.created_by?.toString()) {
      return {
        success: true,
        message: "This is your product",
      };
    } else {
      return {
        success: false,
        message: "You are not the owner of this product",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error?.message,
    };
  }
};

export {
  getAllProductsServices,
  createProductService,
  updateProdctService,
  deleteProductService,
  isProductExist,
  isProductYours,
};
