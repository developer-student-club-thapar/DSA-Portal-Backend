require('dotenv').config()
const express = require('express')
const dbConfig = require('./config/dbConfig')
const registerRoute = require('./routes/registerRoute')
const userRoute = require('./routes/userRoute')

const server = express()

// connect to db
dbConfig()

// middlewares
server.use(express.json())

// routes
server.use('/api/register', registerRoute)
server.use('/api/user', userRoute)

module.exports = server