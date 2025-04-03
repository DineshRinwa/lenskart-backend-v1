const User = require("../models/userSchema");
const bcrypt = require("bcrypt");


// 🔹 Update Password
const updatePassword = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { oldPassword, newPassword } = req.body;

    // 🔹 Validate input
    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both old and new passwords are required." });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters long." });
    }

    // 🔹 Find the user and include password in the result
    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // 🔹 Check if old password matches
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect old password." });
    }

    // 🔹 Update password (no manual hashing)
    user.password = newPassword; // Just assign, pre("save") will hash it

    await user.save(); // 🔹 Triggers pre("save") and hashes automatically

    res.status(200).json({ message: "Password updated successfully!" });

  } catch (error) {
    console.error("Password Update Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = updatePassword;