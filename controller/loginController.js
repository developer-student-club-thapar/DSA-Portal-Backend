const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: "Please enter all fields",
      });
    }

    const user = await User.find({ email });

    if (user == null || user.length == 0) {
      return res.status(400).json({
        status: "Invalid credentials",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user[0].password);
    if (isPasswordMatch) {
      const token = await jwt.sign(
        { leetcodeCookies: user[0].leetcodeCookies, email: email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      user.leetcodeCookies = undefined;
      user.password = undefined;
      res.cookie("jwt", token, {
        expiresIn: new Date(Date.now() + process.env.JWT_EXPIRES_IN),
        httpOnly: true,
      });
      return res.status(200).json({
        token: token,
        leetcodeUserName: user[0].leetcodeUserName,
        name: user[0].name,
      });
    }

    return res.status(400).json({
      status: "Invalid credentials",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      status: "Server error",
    });
  }
};

module.exports = loginController;
