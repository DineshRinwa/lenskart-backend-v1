/**
 * @desc Get all products with optional pagination, sorting, and filtering
 * @route GET /api/products
 * @access Public
 */

const Product = require("../models/productSchema");

// 🔹 Get All Product
const getAllProduct = async (req, res) => {
  try {
    //  Pagination (Default: page 1, limit 10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    //  🔹Sorting (Default: Newest first)
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    //  🔹Enhanced Filtering
    let filter = {};

    // 🔹Basic filters
    if (req.query.frame_color) filter.frame_color = req.query.frame_color;
    if (req.query.frame_size) filter.frame_size = req.query.frame_size;

    // 🔹Numeric filters (with type conversion)
    if (req.query.frame_width) {
      filter.frame_width = parseFloat(req.query.frame_width);
    }

    // 🔹Price range filtering
    if (req.query.minPrice || req.query.maxPrice) {
      filter.discount_price_inr = {};
      if (req.query.minPrice)
        filter.discount_price_inr.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice)
        filter.discount_price_inr.$lte = parseFloat(req.query.maxPrice);
    }

    // 🔹Discount percentage filtering
    if (req.query.minDiscount) {
      filter.discount_percentage = filter.discount_percentage || {};
      filter.discount_percentage.$gte = parseFloat(req.query.minDiscount);
    }

    //  🔹Search functionality (case-insensitive)
    if (req.query.search) {
      filter.$or = [
        { model_no: { $regex: req.query.search, $options: "i" } },
        { frame_color: { $regex: req.query.search, $options: "i" } },
        { frame_dimensions: { $regex: req.query.search, $options: "i" } },
      ];
    }

    //  🔹Average rating filter
    if (req.query.minRating) {
      // 🔹Use aggregation to filter by average review rating
      const minRating = parseFloat(req.query.minRating);
      const productsWithMinRating = await Product.aggregate([
        {
          $addFields: {
            averageRating: { $avg: "$reviews.rating" },
          },
        },
        {
          $match: {
            averageRating: { $gte: minRating },
          },
        },
        {
          $project: {
            _id: 1,
          },
        },
      ]);

      // 🔹Add product IDs to filter
      if (productsWithMinRating.length > 0) {
        const productIds = productsWithMinRating.map((p) => p._id);
        filter._id = { $in: productIds };
      } else {
        // 🔹If no products match rating criteria, return empty array
        return res.status(200).json({
          success: true,
          totalProducts: 0,
          currentPage: page,
          totalPages: 0,
          products: [],
        });
      }
    }

    // 🔹 Fetch Products
    const products = await Product.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    // 🔹 Count Total Products for Pagination Info
    const totalProducts = await Product.countDocuments(filter);

    // 🔹 Add average rating to each product
    const productsWithAvgRating = products.map((product) => {
      const productObj = product.toObject();
      if (productObj.reviews && productObj.reviews.length > 0) {
        const totalRating = productObj.reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        productObj.averageRating = parseFloat(
          (totalRating / productObj.reviews.length).toFixed(1)
        );
      } else {
        productObj.averageRating = 0;
      }
      return productObj;
    });

    // 🔹 Response
    res.status(200).json({
      success: true,
      totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      products: productsWithAvgRating,
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
