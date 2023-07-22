const User = require("../models/User");

const getUserDetailsController = async (req, res) => {
    try{

        const { leetcodeUserName } = req.params;

        const user = await User.findOne({ leetcodeUserName });

        if(!user) {
            return res.status(404).send("User not found");
        }

        user.password = undefined;
        user.leetcodeCookies = undefined;
        user.email = undefined;

        const { name, leetcodeUserName: leetcodeUserNameFromDB, solvedProblems } = user;

        res.status(200).json({
            name,
            leetcodeUserName: leetcodeUserNameFromDB,
            solvedProblems
        });

    } catch (err) {

        console.log(err);
        res.status(500).send("Internal Server Error");
        
    }
}

module.exports = getUserDetailsController;