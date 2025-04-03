const express = require("express");
const {getOrderList, createOrder} = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/get", authMiddleware, getOrderList);
router.post("/create", authMiddleware, createOrder);
module.exports = router;