const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true,
    },
    leetcodeUserName: {
        type: String,
        required: true,
        unique: true,
    },
    leetcodeCookies: {
        type: String,
        required: true
    },
    solvedProblems: {
        type: [String],
        required: true
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User