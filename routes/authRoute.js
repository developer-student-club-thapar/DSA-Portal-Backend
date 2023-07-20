const express = require('express')
const router = express.Router()

const registerController = require('../controller/registerController')
const loginController = require('../controller/loginController')

router.post('/register', registerController)
router.post('/login', loginController)

module.exports = router