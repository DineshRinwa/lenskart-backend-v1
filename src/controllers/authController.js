const generateToken = require("../utils/generateToken");
const User = require("../models/userSchema");


// 🔹 User Register
const  registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const user = await User.create({ username, email, password });

    // 🔹 Generate Tokens
    const accessToken = generateToken(
      user._id,
      process.env.ACCESS_SECRET,
      "15m"
    );
    const refreshToken = generateToken(
      user._id,
      process.env.REFRESH_SECRET,
      "7d"
    );

    // 🔹 Set Secure Refresh Token in HTTP-only Cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, username, email },
      accessToken,
    });
  } catch (error) {
    es.status(500).json({ error: "Server Error: " + error.message });
  }
};


// 🔹 User Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    // 🔹 Generate Tokens
    const accessToken = generateToken(
      user._id,
      process.env.ACCESS_SECRET,
      "15m"
    );
    const refreshToken = generateToken(
      user._id,
      process.env.REFRESH_SECRET,
      "7d"
    );

    // 🔹 Set Secure Refresh Token in HTTP-only Cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: "Login successful",
      user: { id: user._id, username: user.username, email: user.email },
      accessToken,
    });

  } catch (error) {
    res.status(500).json({ error: "Server Error: " + error.message });
  }
};


module.exports = { registerUser, loginUser };