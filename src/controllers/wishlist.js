const User = require("../models/userSchema");
const Product = require("../models/productSchema");

const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res
        .status(400)
        .json({ message: "User ID and Product ID are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const product = await Product.findById(productId).lean();
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getWishList = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .populate("wishlist")
      .select("cart");

    if (!user) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(user.wishlist); // ✅ Return wishlist with product details
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = addToWishlist;
module.exports = getWishList;