require('dotenv').config()
const express = require('express')
const dbConfig = require('./config/dbConfig')
const authRoute = require('./routes/authRoute')
const userRoute = require('./routes/userRoute')

const server = express()

// connect to db
dbConfig()

// middlewares
server.use(express.json())

// routes
server.use('/api/auth', authRoute)
server.use('/api/user', userRoute)

module.exports = server