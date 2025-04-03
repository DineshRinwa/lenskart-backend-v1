const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    product_id: { type: Number, required: true, unique: true }, 
    model_no: { type: String, required: true },
    frame_size: { type: String, required: true },
    frame_width: { type: Number, required: true },
    frame_dimensions: { type: String, required: true },
    frame_color: { type: String, required: true },
    price_inr: { type: Number, required: true },
    discount_price_inr: { type: Number, required: true },
    discount_percentage: { type: Number, required: true },
    images: [{ type: String }], // Array of image URLs
    reviews: [
      {
        user: { type: String, required: true },
        rating: { type: Number, min: 1, max: 5, required: true },
        comment: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;