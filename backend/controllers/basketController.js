import mongoose from "mongoose";
import Basket from "../models/basket.js";
import Product from "../models/product.js";

const getAuthenticatedEmail = (req) => {
  return req.session.user.email.toLowerCase();
};

export const createBasketItem = async (req, res) => {
  try {
    const { productId } = req.body;
    const userEmail = getAuthenticatedEmail(req);

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }
    const productExists = await Product.exists({
      _id: productId,
    });

    if (!productExists) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    const basketItem = await Basket.findOneAndUpdate(
      {
        productId,
        userEmail,
      },
      {
        $inc: {
          quantity: 1,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    ).populate("productId", "imageURL name description price");

    return res.status(201).json({
      message: "Product added to basket",
      basketItem,
    });
  } catch (err) {
    console.error("Create basket item error:", err);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getBasketItems = async (req, res) => {
  try {
    const userEmail = getAuthenticatedEmail(req);

    const basketItems = await Basket.find({
      userEmail,
    })
      .populate("productId", "imageURL name description price")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Basket items retrieved",
      basketItems,
    });
  } catch (err) {
    console.error("Get basket items error:", err);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const updateBasketItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userEmail = getAuthenticatedEmail(req);

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be an integer greater than or equal to 1",
      });
    }

    const basketItem = await Basket.findOneAndUpdate(
      {
        userEmail,
        productId,
      },
      {
        $set: {
          quantity,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    ).populate("productId", "imageURL name description price");

    if (!basketItem) {
      return res.status(404).json({
        message: "Basket item not found",
      });
    }

    return res.status(200).json({
      message: "Basket item updated",
      basketItem,
    });
  } catch (err) {
    console.error("Update basket item error:", err);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const deleteBasketItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const userEmail = getAuthenticatedEmail(req);

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const basketItem = await Basket.findOneAndDelete({
      userEmail,
      productId,
    });

    if (!basketItem) {
      return res.status(404).json({
        message: "Basket item not found",
      });
    }

    return res.status(200).json({
      message: "Basket item deleted",
    });
  } catch (err) {
    console.error("Delete basket item error:", err);

    return res.status(500).json({
      message: "Server error",
    });
  }
};
