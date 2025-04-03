const User = require("../models/userSchema");
const Product = require("../models/productSchema");


//  Get Order List
const getOrderList = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
    .populate("order")
    .select("order");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      orders: user.order,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


//  Buy New Product 
const createOrder = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    if (!userId || !productId) {
      return res
        .status(400)
        .json({ message: "User ID and Product ID are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const product = await Product.findById(productId).lean();
    if (!product) return res.status(404).json({ message: "Product not found" });

    user.order.push(productId);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Order created Successfully",
      cart: user.order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getOrderList, createOrder };
