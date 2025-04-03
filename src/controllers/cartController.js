const User = require("../models/userSchema");
const Product = require("../models/productSchema");

// ✅ Add New Cart
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    if (!productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid Product ID and quantity are required",
      });
    }

    //  Check if product exists
    const product = await Product.findById(productId).lean();
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    //  Update cart using MongoDB's `$set` & `$inc`
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, "cart.productId": productId },
      { $inc: { "cart.$.quantity": quantity } }, // If exists, increment quantity
      { new: true, select: "cart" }
    );

    if (!updatedUser) {
      // If product is not already in cart, add it
      await User.findByIdAndUpdate(
        userId,
        { $push: { cart: { productId, quantity } } },
        { new: true, select: "cart" }
      );
    }

    //  Fetch updated cart
    const userWithCart = await User.findById(userId).select("cart").lean();

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart: userWithCart.cart,
    });
  } catch (error) {
    console.error("Error in addToCart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ Get All Cart
const getAllCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .populate("cart.productId")
      .select("cart");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Cart retrieved successfully",
      cart: user.cart, //  Now contains detailed product info
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// 🔹 Remove Cart
const removeCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Remove the product completely from the cart
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { cart: { productId } } },
      { new: true, select: "cart" }
    ).populate("cart.productId");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found or product not in cart",
      });
    }

    // Get the full product details from cart and return as an array
    const products = updatedUser.cart.map((item) => item.productId);

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
      products,
    });
  } catch (error) {
    console.error("Error in removeFromCart:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { addToCart, getAllCart, removeCart };
