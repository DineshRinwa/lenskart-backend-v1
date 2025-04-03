require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./src/config/db");

const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const cartRoutes = require("./src/routes/cartRoutes");
const wishlistRoutes = require("./src/routes/wishlistRoutes");
const productRoutes = require("./src/routes/productRoutes");
const orderRoutes = require("./src/routes/orderRoutes");

const app = express();

// 🔹 Middleware
app.use(express.json());
// ✅ Dynamic CORS Configuration
const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:5173"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // ✅ Allow cookies & authentication headers
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());

// 🔹 Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/products", productRoutes);
app.use("/api/order", orderRoutes);

// 🔹 Base Route
app.get("/", (req, res) => {
  res.send("✅ Welcome to the Home Page!");
});

// 🔹 Define Port
const PORT = process.env.PORT || 5000;

// 🔹 Start Server
app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});