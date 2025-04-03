const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  let token = req.header("Authorization")?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Access Denied" });

  try {
    // 🔹Verify Access Token
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    req.user = decoded;
    return next(); 

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // 🔹 If Access Token is expired, check for Refresh Token
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken)
        return res.status(403).json({ error: "Refresh Token Missing" });

      try {
        // 🔹Verify Refresh Token
        const decodedRefresh = jwt.verify(
          refreshToken,
          process.env.REFRESH_SECRET
        );

        // 🔹Generate a new Access Token
        const newAccessToken = jwt.sign(
          { userId: decodedRefresh.userId },
          process.env.ACCESS_SECRET,
          { expiresIn: "15m" }
        );

        // 🔹 Send new Access Token in response header
        res.setHeader("Authorization", `Bearer ${newAccessToken}`);

        // ✅ Attach new Access Token to request and proceed
        req.user = decodedRefresh;
        return next();
      } catch (refreshError) {
        return res.status(403).json({ error: "Invalid Refresh Token" });
      }
    }

    return res.status(403).json({ error: "Invalid Token" });
  }
};

module.exports = authMiddleware;