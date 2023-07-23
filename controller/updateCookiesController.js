const Authenticator = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const updateCookiesController = async (req, res, next) => {
  try {
    const { leetcodeCookies: newLeetcodeCookies } = req.body;

    const token = req.header("Authorization");
    const tokenWithoutBearer = token.split(" ")[1];
    const decodedToken = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);

    const user = await User.findOneAndUpdate(
      { email: decodedToken.email },
      { leetcodeCookies: newLeetcodeCookies },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "Leetcode cookies updated successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "Internal Server Error",
    });
  }
};

module.exports = updateCookiesController;
