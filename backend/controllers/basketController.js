import mongoose from "mongoose";
import Basket from "../models/basket.js";

export const createBasketItem = async (req, res) => {
  try {
    const { productId, userEmail } = req.body;

    if (!productId || !userEmail) {
      return res.status(400).json({
        message: "Product ID and user email are required",
      });
    }

    if (!userEmail.includes("@")) {
      return res.status(400).json({
        message: "Email is not valid",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const basketItem = await Basket.findOneAndUpdate(
      {
        productId,
        userEmail: userEmail.toLowerCase(),
      },
      {
        $inc: { quantity: 1 },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    return res.status(201).json({
      message: "Product added to basket",
      basketItem,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getBasketItems = async (req, res) => {
  try {
    const { userEmail } = req.params;

    if (!userEmail) {
      return res.status(400).json({
        message: "User email is required",
      });
    }

    if (!userEmail.includes("@")) {
      return res.status(400).json({
        message: "Email is not valid",
      });
    }

    const basketItems = await Basket.find({
      userEmail: userEmail.toLowerCase(),
    });

    return res.status(200).json({
      message: "Basket items retrieved",
      basketItems,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const updateBasketItem = async (req, res) => {
  try {
    const { userEmail, productId } = req.params;
    const { quantity } = req.body;

    if (!userEmail || !productId) {
      return res.status(400).json({
        message: "User email and product ID are required",
      });
    }

    if (!userEmail.includes("@")) {
      return res.status(400).json({
        message: "Email is not valid",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1",
      });
    }

    const basketItem = await Basket.findOneAndUpdate(
      {
        userEmail: userEmail.toLowerCase(),
        productId,
      },
      {
        quantity,
      },
      {
        new: true,
        runValidators: true,
      },
    );

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
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const deleteBasketItem = async (req, res) => {
  try {
    const { userEmail, productId } = req.params;

    if (!userEmail || !productId) {
      return res.status(400).json({
        message: "User email and product ID are required",
      });
    }

    if (!userEmail.includes("@")) {
      return res.status(400).json({
        message: "Email is not valid",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const basketItem = await Basket.findOneAndDelete({
      userEmail: userEmail.toLowerCase(),
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
    return res.status(500).json({
      message: "Server error",
    });
  }
};
