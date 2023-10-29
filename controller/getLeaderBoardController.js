const User = require("../models/User");
const { LeetCode, Credential } = require("leetcode-query");
const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.SECRET_KEY_CRYPTR);
const Problem = require("../models/Problem");

const getLeaderBoardController = async (req, res) => {
  try {
    const users = await User.find();

    for (const user of users) {
      try {
        const leetcodeCookies = cryptr.decrypt(user.leetcodeCookies);
        const credential = new Credential();
        await credential.init(leetcodeCookies);
        const leetcode = new LeetCode(credential);

        const allSubmissions = await leetcode.submissions();

        const solvedProblems = allSubmissions.filter((submission) => {
          return submission.status_display === "Accepted";
        });

        const solvedProblemsArr = solvedProblems.map((submission) => {
          return {
            titleSlug: submission.title_slug,
            title: submission.title,
          };
        });

        // Remove duplicate problems
        const uniqueProblems = solvedProblemsArr.filter(
          (problem, index, self) => {
            return (
              index === self.findIndex((p) => p.titleSlug === problem.titleSlug)
            );
          }
        );

        // Update or insert the user's solved problems into the database
        for (const problem of uniqueProblems) {
          await Problem.findOneAndUpdate(
            {
              titleSlug: problem.titleSlug,
              title: problem.title,
            },
            {
              titleSlug: problem.titleSlug,
              title: problem.title,
              $addToSet: { solvedBy: user._id },
            },
            { upsert: true, new: true }
          );
        }

        user.solvedProblems = uniqueProblems.map(
          (problem) => problem.titleSlug
        );

        // Save the updated user
        await user.save();
      } catch (err) {
        console.error(`Error for user ${user.email}: ${err}`);
      }
    }

    const finalUsers = users.map((user) => {
      return {
        _id: user._id,
        name: user.name,
        leetcodeUserName: user.leetcodeUserName,
        solvedProblems: user.solvedProblems,
      };
    });

    return res.status(200).json(finalUsers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "Internal Server Error",
    });
  }
};

module.exports = getLeaderBoardController;
