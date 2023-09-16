const express = require("express");
const router = express.Router();

const getLeaderBoardController = require("../controller/getLeaderBoardController");
const getUserDetailsController = require("../controller/getUserDetailsController");
const getAllUsers = require("../controller/getAllUsers");

// gets all users
router.get("/users", getAllUsers);

router.get("/", getLeaderBoardController);
router.get("/:leetcodeUserName", getUserDetailsController);

module.exports = router;
