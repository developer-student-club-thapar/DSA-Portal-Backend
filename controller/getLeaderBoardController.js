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
        const allSubmissions = await leetcode.submissions({
          limit: 2000,
          offset: 0,
        });

        console.log(allSubmissions);

        const solvedProblems = allSubmissions.filter((submission) => {
          return submission.statusDisplay === "Accepted";
        });

        const solvedProblemsArr = solvedProblems.map((submission) => {
          return {
            titleSlug: submission.titleSlug,
            title: submission.title,
          };
        });

        const uniqueProblems = solvedProblemsArr.filter(
          (problem, index, self) => {
            return (
              index === self.findIndex((p) => p.titleSlug === problem.titleSlug)
            );
          }
        );

        // Update or insert the user's solved problems into the database
        for (const problem of uniqueProblems) {
          const existingProblem = await Problem.findOne({
            title: problem.title,
          });
          if (existingProblem) {
            await Problem.findOneAndUpdate(
              { title: problem.title },
              { $addToSet: { solvedBy: user._id } },
              { new: true }
            );
          } else {
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
        }

        user.solvedProblems = uniqueProblems.map(
          (problem) => problem.titleSlug
        );

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
