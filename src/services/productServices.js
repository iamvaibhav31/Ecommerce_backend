import productModels from "../models/productModels.js";
import { nanoid } from "nanoid";

const getAllProductsServices = async (params, callback) => {
  try {


  } catch (error) {}
};

const createProductService = async (params, callback) => {
  try {
    const { name, description, price, rating, images_urls, category, stock } =
      params;

    const productImage = images_urls.map((url) => {
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
      images: productImage,
      category,
      stock,
    });

    await product.save();

    return callback(false, {
      status: true,
      product,
    });
  } catch (error) {
    return callback({
      status: false,
      message: error?.message || "Something went wrong",
    });
  }
};

export { getAllProductsServices, createProductService };
