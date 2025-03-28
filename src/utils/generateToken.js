const jwt = require("jsonwebtoken");

const generateToken = (userId, secret, expiresIn) => {
  return jwt.sign({ id: userId }, secret, { expiresIn });
};

module.exports = generateToken;
