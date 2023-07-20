const User = require('../models/User');
const { LeetCode, Credential } = require('leetcode-query');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.SECRET_KEY);
const sheet = require('../sheet.json');

const getLeaderBoardController = async (req, res) => {
  try {
    const users = await User.find();

    const userCookies = users.map((user) => {
      return {
        name: user.name,
        email: user.email,
        leetcodeUserName: user.leetcodeUserName,
        leetcodeCookies: cryptr.decrypt(user.leetcodeCookies)
      };
    });

    for (const user of userCookies) {
      const credential = new Credential();
      await credential.init(user.leetcodeCookies);
      const leetcode = new LeetCode(credential);
      const allProblems = await leetcode.submissions(100, 0);

      const solvedProblems = allProblems.filter((problem) => {
        return problem.statusDisplay === 'Accepted';
      });

      const solvedProblemsArr = solvedProblems.map((problem) => {
        return {
          titleSlug: problem.titleSlug,
          title: problem.title
        };
      });

      const matchedProblems = solvedProblemsArr.filter((problem) => {
        return sheet.some((row) => row.titleSlug === problem.titleSlug);
      });

      const matchedSlugs = matchedProblems.map((problem) => problem.titleSlug);

      const uniqueSlugs = new Set(matchedSlugs);
      user.solvedProblems = Array.from(uniqueSlugs);

      const existingUser = await User.findOneAndUpdate(
        { email: user.email }, 
        { solvedProblems: user.solvedProblems }
    );
      if (!existingUser) {
        throw new Error('User not found');
      }
    }

    const allUsers = await User.find();
    allUsers.forEach((user) => {
      user.leetcodeCookies = undefined;
    });

    return res.status(200).json(allUsers);

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'Internal Server Error'
    });
  }
};

module.exports = getLeaderBoardController;
