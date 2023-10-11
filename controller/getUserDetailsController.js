const User = require("../models/User");
const { LeetCode, Credential } = require("leetcode-query");
const getUserDetailsController = async (req, res) => {
  try {
    const leetcode = new LeetCode();
    const userDetails = await leetcode.user("mash_sharma");
    const userAvatar = userDetails.matchedUser.profile.userAvatar;
    const rank = userDetails.matchedUser.profile.ranking;
    const totalSubmissions =
      userDetails.matchedUser.submitStats.acSubmissionNum[0].count;

    const { leetcodeUserName } = req.params;

    const user = await User.findOne({ leetcodeUserName });

    if (!user) {
      return res.status(404).send("User not found");
    }

    user.password = undefined;
    user.leetcodeCookies = undefined;
    user.email = undefined;

    const {
      name,
      leetcodeUserName: leetcodeUserNameFromDB,
      solvedProblems,
    } = user;

    res.status(200).json({
      name,
      leetcodeUserName: leetcodeUserNameFromDB,
      solvedProblems,
      userAvatar,
      rank,
      totalSubmissions,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = getUserDetailsController;
