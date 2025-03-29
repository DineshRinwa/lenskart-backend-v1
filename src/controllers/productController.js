const Product = require("../models/productSchema");

/**
 * @desc Get all products with optional pagination, sorting, and filtering
 * @route GET /api/products
 * @access Public
 */


// 🔹 Get All Product
const getAllProduct = async (req, res) => {
  try {
    // ✅ Pagination (Default: page 1, limit 10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // ✅ Sorting (Default: Newest first)
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    // ✅ Filtering (e.g., ?frameColor=black&minPrice=1000&maxPrice=5000)
    let filter = {};
    if (req.query.frameColor) filter.frameColor = req.query.frameColor;
    if (req.query.minPrice || req.query.maxPrice) {
      filter.discountPrice = {};
      if (req.query.minPrice)
        filter.discountPrice.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice)
        filter.discountPrice.$lte = parseFloat(req.query.maxPrice);
    }

    // ✅ Fetch Products
    const products = await Product.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    // ✅ Count Total Products for Pagination Info
    const totalProducts = await Product.countDocuments(filter);

    // ✅ Response
    res.status(200).json({
      success: true,
      totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// 🔹Get One Product
const getOneProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    // ✅ Response
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { getAllProduct, getOneProduct };