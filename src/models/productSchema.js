const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productId: { type: Number, required: true, unique: true }, // Unique product identifier
    modelNo: { type: String, required: true },
    frameSize: { type: String, required: true },
    frameWidth: { type: Number, required: true },
    frameDimensions: { type: String, required: true },
    frameColor: { type: String, required: true },
    images: [{ type: String }], // Array of image URLs
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5, required: true },
        comment: { type: String, required: true },
      },
    ],
    originalPrice: { type: Number, required: true },
    discountPrice: { type: Number, required: true },
    discountPercentage: { type: Number, required: true },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;