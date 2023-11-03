import productModels from "../models/productModels.js";
import { nanoid } from "nanoid";

const getAllProductsServices = async (params, callback) => {
  try {
    const { page = 1, limit = 10, name, sellerId, category, price } = params;
    let skip = (Number(page) - 1) * limit;
    let query = {};
    
    if (name) {
      query["name"] = { "$regex": `${name}`, "$options": "i" };
    }
    
    if (category) {
      
      const parsedCategories = JSON.parse(category);
      query["category"] = { "$in": parsedCategories };
    }
    
    if (price) {
      // Construct the price query object
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
      query['price'] = { ...priceQuery };
    }
    
    console.log(query);
    

    console.log(query)
    let products = await productModels
      .find(query)
      .skip(skip)
      .limit(Number(limit));

    return callback(false, {
      success: true,
      products,
      totalCount: products?.length,
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
    const { name, description, price, rating, images_urls, category, stock , id } =
      params;

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
      created_by:id
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
    const {
      id,
      name,
      description,
      price,
      rating,
      images_urls,
      category,
      stock,
      productDetails,
    } = params;

    const productImage = images_urls?.map((url) => {
      return {
        public_id: nanoid(),
        url: url,
      };
    });

    const product = await productModels.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        rating,
        images: [...(productDetails?.images || []), ...(productImage || [])],
        category: [...(productDetails?.category || []), ...(category || [])],
        stock,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: true,
      }
    );
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

const isProductYours = () => {};

export {
  getAllProductsServices,
  createProductService,
  updateProdctService,
  deleteProductService,
  isProductExist,
};
