require('dotenv').config()
const express = require('express')
const dbConfig = require('./config/dbConfig')
const authRoute = require('./routes/authRoute')
const userRoute = require('./routes/userRoute')
const auth = require('./middleware/auth')
const cookieParser = require('cookie-parser')

const server = express()

// connect to db
dbConfig()

// middlewares
server.use(express.json())
server.use(cookieParser())

// routes
server.use('/api/auth', authRoute)
server.use('/api/user', auth, userRoute)

module.exports = server