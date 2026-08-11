const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  // creates jwt token 
  return jwt.sign(
    {
      id: userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

module.exports = generateToken;