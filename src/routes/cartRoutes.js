const express = require('express');
const addToCart = require("../controllers/cartController");
const getAllCart = require("../controllers/cartController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/add", authMiddleware, addToCart);
router.get('/get', authMiddleware, getAllCart);

module.exports = router;