const User = require('./../models/User')
const Cryptr = require('cryptr')
const cryptr = new Cryptr(process.env.CRYPTR_SECRET_KEY)

const registerController = async(req, res)=>{
    try {
        const {name, email, leetcodeUserName, leetcodeCookies} = req.body

        if(!name || !email || !leetcodeUserName || !leetcodeCookies){
            return res.status(400).json({
                status: 'Please enter all fields'
            })
        }

        const existingUser = await User.findOne({email})

        if(existingUser){
            return res.status(400).json({
                status: 'User already exists'
            })
        }

        const encryptedCookies = cryptr.encrypt(leetcodeCookies)

        const user = await User.create({
            ...req.body,
            'leetcodeCookies': encryptedCookies
        })

        user.leetcodeCookies = undefined

        return res.status(201).json(user)

    } catch (error) {
        console.log(error)

        return res.status(500).json({
            status: 'Server error'
        })
    }
}

module.exports = registerController