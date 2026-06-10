import mongoose from "mongoose";

const basketSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    userEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  },
  { timestamps: true },
);

basketSchema.index({ userEmail: 1, productId: 1 }, { unique: true });

export default mongoose.model("Basket", basketSchema);
