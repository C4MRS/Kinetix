export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      products,
    });
  } catch (error) {
    console.error("Admin get products error:", error);

    return res.status(500).json({
      message: "Unable to retrieve products",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const existingProduct = await product.findById(productId);

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await product.findByIdAndDelete(productId);

    await Basket.deleteMany({
      productId,
    });

    try {
      const index = meili.index("products");

      const task = await index.deleteDocument(productId);

      await meili.waitForTask(task.taskUid);

      console.log("Product removed from Meilisearch.");
    } catch (meiliError) {
      console.warn(
        "Failed to remove product from Meilisearch:",
        meiliError.message,
      );
    }

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    return res.status(500).json({
      message: "Unable to delete product",
    });
  }
};
