const express = require('express');
const wishlist = require("../controllers/wishlist");
const getWishList = require("../controllers/wishlist");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/add", authMiddleware, wishlist);
router.get("/get", authMiddleware, getWishList);

module.exports = router;