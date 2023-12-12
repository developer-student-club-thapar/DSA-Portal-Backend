const User = require("./../models/User");
const cryptr = require("cryptr");
const Cryptr = new cryptr(process.env.SECRET_KEY_CRYPTR);
const bcrypt = require("bcryptjs");
const { LeetCode, Credential } = require("leetcode-query");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    const { name, email, leetcodeUserName, leetcodeCookies, password } =
      req.body;

    if (!name || !email || !leetcodeUserName || !leetcodeCookies || !password) {
      return res.status(400).json({
        status: "Please enter all fields",
      });
    }

    const existingUser = await User.findOne({ email });
    const checkLeetCode = await User.findOne({ leetcodeUserName });

    if (existingUser || checkLeetCode) {
      return res.status(400).json({
        status: "User already exists",
      });
    }

    const encryptedCookies = await Cryptr.encrypt(leetcodeCookies);
    const encryptedPassword = await bcrypt.hash(password, 10);

    const credential = new Credential();
    await credential.init(leetcodeCookies);
    const leetcode = new LeetCode(credential);
    const data = await leetcode.submissions({ limit: 2000, offset: 0 });

    const solvedProblems = [];

    console.log(data);

    data.forEach((element) => {
      if (element.statusDisplay === "Accepted") {
        solvedProblems.push({
          titleSlug: element.titleSlug,
          title: element.title,
        });
      }
    });

    const user = await User.create({
      ...req.body,
      leetcodeCookies: encryptedCookies,
      password: encryptedPassword,
      solvedProblems: solvedProblems,
    });

    const token = jwt.sign(
      { leetcodeCookies: encryptedCookies },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.cookie("jwt", token, {
      expiresIn: process.env.JWT_EXPIRES_IN,
      httpOnly: true,
    });

    user.leetcodeCookies = undefined;
    user.password = undefined;

    return res.status(201).json(user);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      status: "Server error",
    });
  }
};

module.exports = registerController;
