const express = require('express')
const router = express.Router()

const getLeaderBoardController = require('../controller/getLeaderBoardController')

router.get('/', getLeaderBoardController)

module.exports = router