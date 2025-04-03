const User = require("../models/userSchema");
const Product = require("../models/productSchema");

// ✅ Add New Wishlist
const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    // Validate input
    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required" });
    }

    // Check if product exists
    const product = await Product.findById(productId).lean();
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Add to wishlist only if not already present
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { wishlist: productId } }, // ✅ Ensures no duplicates
      { new: true, select: "wishlist" } // ✅ Returns updated wishlist
    );

    res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      wishlist: updatedUser.wishlist,
    });
  } catch (error) {
    console.error("Error in addToWishlist:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ Get All Wishlist
const getWishList = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .populate("wishlist")
      .select("wishlist");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Wishlist retrieved successfully",
      wishlist: user.wishlist, //  Now contains detailed product info
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Remove Product from wishlist
const removeWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // ✅ Remove product from wishlist array
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: productId } },
      { new: true, select: "wishlist" }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found or product not in cart",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      cart: updatedUser.cart,
    });
  } catch (error) {
    console.error("Error in removeFromCart:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ✅ Check if product is in wishlist
const checkWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;

    // Validate input
    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required" });
    }

    // Find user and check if product is in wishlist
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if product exists in wishlist
    const isInWishlist = user.wishlist.includes(productId);

    res.status(200).json({
      success: true,
      isInWishlist,
    });
  } catch (error) {
    console.error("Error in checkWishlist:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update the exports to include the new function
module.exports = {
  addToWishlist,
  getWishList,
  removeWishlist,
  checkWishlist,
};