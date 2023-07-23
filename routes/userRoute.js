const express = require('express')
const router = express.Router()

const getLeaderBoardController = require('../controller/getLeaderBoardController')
const getUserDetailsController = require('../controller/getUserDetailsController')

router.get('/', getLeaderBoardController)
router.get('/:leetcodeUserName', getUserDetailsController)

module.exports = router