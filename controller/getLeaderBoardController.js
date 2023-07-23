const User = require("../models/User");
const { LeetCode, Credential } = require("leetcode-query");
const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.SECRET_KEY_CRYPTR);
const Problem = require("../models/Problem");

const getLeaderBoardController = async (req, res) => {
  try {
    const users = await User.find();

    const userCookies = users.map((user) => {
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        leetcodeUserName: user.leetcodeUserName,
        leetcodeCookies: cryptr.decrypt(user.leetcodeCookies),
      };
    });

    for (const user of userCookies) {
      const credential = new Credential();
      await credential.init(user.leetcodeCookies);
      const leetcode = new LeetCode(credential);
      const allProblems = await leetcode.submissions(100, 0);

      const solvedProblems = allProblems.filter((problem) => {
        return problem.statusDisplay === "Accepted";
      });

      const solvedProblemsArr = solvedProblems.map((problem) => {
        return {
          titleSlug: problem.titleSlug,
          title: problem.title,
        };
      });

      const filteredProblemsArr = solvedProblemsArr.filter((item, index) => {
        const firstIndex = solvedProblemsArr.findIndex(
          (obj) => obj.titleSlug === item.titleSlug
        );
        return index === firstIndex;
      });

      filteredProblemsArr.map(async (problem) => {
        const userProb = await Problem.findOneAndUpdate(
          {
            titleSlug: problem.titleSlug,
            title: problem.title,
          },
          {
            titleSlug: problem.titleSlug,
            title: problem.title,
          },
          { upsert: true, new: true }
        );
        if (!userProb.solvedBy || !userProb.solvedBy.includes(user._id)) {
          const prob = await Problem.findOneAndUpdate(
            {
              titleSlug: problem.titleSlug,
              title: problem.title,
            },
            {
              titleSlug: problem.titleSlug,
              title: problem.title,
              $push: { solvedBy: user._id },
            },
            { upsert: true, new: true }
          );
        }
      });

      const matchedSlugs = filteredProblemsArr.map(
        (problem) => problem.titleSlug
      );

      const uniqueSlugs = new Set(matchedSlugs);
      user.solvedProblems = Array.from(uniqueSlugs);

      const existingUser = await User.findOneAndUpdate(
        { email: user.email },
        { solvedProblems: user.solvedProblems }
      );
      if (!existingUser) {
        throw new Error("User not found");
      }
    }

    const allUsers = await User.find();
    const finalUsers = allUsers.map((user) => {
      return {
        _id: user._id,
        name: user.name,
        leetcodeUserName: user.leetcodeUserName,
        solvedProblems: user.solvedProblems,
      };
    });

    return res.status(200).json(finalUsers);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "Internal Server Error",
    });
  }
};

module.exports = getLeaderBoardController;
