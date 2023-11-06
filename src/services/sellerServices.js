import sellerModel from "../models/sellerModel.js";

const createSellerService = async (params, callback) => {
  try {
    const { userID, totalStock } = params;

    const seller = new sellerModel({
      user_id: userID,
      totalStock,
    });
    console.log("createSellerService" , seller)
    await seller.save();

    return callback(false, {
      success: true,
      seller,
    });
  } catch (error) {
    return callback({
      success: false,
      message: error?.message,
    });
  }
};

export { createSellerService };
