const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const updatePassword = require("../controllers/userController");

const router = express.Router();

router.put("/update-password", authMiddleware, updatePassword);

module.exports = router;