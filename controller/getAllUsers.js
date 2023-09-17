const User = require("../models/User");
const getAllUsers = async (req, res) => {
  try {
    // finds all users and returns JUST _id / name / solvedProblems / leetcodeUserName of them
    const users = await User.find(
      {},
      "_id name solvedProblems leetcodeUserName"
    );
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ errorMessage: "Server Error" });
  }
};

module.exports = getAllUsers;
