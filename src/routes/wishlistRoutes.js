const express = require('express');
const {addToWishlist, getWishList, removeWishlist, checkWishlist} = require("../controllers/wishlist");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/add", authMiddleware, addToWishlist);
router.get("/get", authMiddleware, getWishList);
router.delete("/remove/:id", authMiddleware, removeWishlist);
router.get("/check/:id", authMiddleware, checkWishlist);

module.exports = router;