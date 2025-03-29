const User = require("../models/userSchema");
const Product = require("../models/productSchema");

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity = 1 } = req.body;

    if (!userId || !productId) {
      return res
        .status(400)
        .json({ message: "User ID and Product ID are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const product = await Product.findById(productId).lean();
    if (!product) return res.status(404).json({ message: "Product not found" });

    const cartItem = user.cart.find(
      (item) => item.productId.toString() === productId
    );

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      user.cart.push({ productId, quantity });
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart: user.cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .populate("cart.productId") // Fetch full product details
      .select("cart"); // Only return cart field

      
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.cart); // ✅ Return cart with product details
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = addToCart;
module.exports = getAllCart;