const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { getAllProduct, getOneProduct } = require("../controllers/productController");
const router = express.Router();

router.get("/", getAllProduct);
router.get('/:id', authMiddleware, getOneProduct);

module.exports = router;