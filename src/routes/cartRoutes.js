const express = require("express");
const { addToCart, getAllCart, removeCart } = require("../controllers/cartController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/add", authMiddleware, addToCart);
router.get("/get", authMiddleware, getAllCart);
router.delete("/remove/:id", authMiddleware, removeCart);

module.exports = router;