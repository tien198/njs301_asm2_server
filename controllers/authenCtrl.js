import { hashSync, compareSync } from 'bcrypt'
import { log, error } from 'console';

import User from '../models/user.js'
import { jwtGen, jwtVerify } from '../utilities/jwtToken.js';


function createPayload(userInstance) {
    const { _id, userName, fullName, phoneNumber, email, isAdmin } = userInstance
    return {
        userId: _id,
        userName, fullName, phoneNumber, email, isAdmin,
    }
}

export async function login(req, res, next) {
    const { userName, password } = req.body
    try {
        let user = await User.findOne({ userName }).lean()
        if (!user) user = await User.findOne({ email: userName })
        if (!user || !compareSync(password, user.password)) {
            const errorRes = {
                message: 'Fail to login',
                errors: { credential: 'wrong password or username' }
            }
            return res.status(401).json(errorRes)
        }

        if (user) {
            const payload = createPayload(user)
            const jwt = 'Bearer ' + jwtGen(payload)
            return res.status(202).json({
                user: payload,
                token: jwt
            })
        }
    } catch (err) {
        error(err)
        next(err)
    }
}

export async function signUp(req, res, next) {
    const { userName, password, fullName, phoneNumber, email: inputEmail } = req.body
    const email = inputEmail || userName

    const hash = hashSync(password, 12)
    let errors = {}
    try {
        const user = await User.findOne({ userName })
        if (user)
            errors.userName = 'UserName existed'
    } catch (err) { error(err) }

    if (password.length < 6)
        errors.password = 'Password must be at least 6 characters'

    if (Object.keys(errors).length > 0) {
        const errorRes = {
            status: 422,
            message: 'Fail to create user',
            errors: errors
        }
        return res.status(422).json(errorRes)
    }

    try {
        const newUser = new User({ userName, password: hash, fullName, phoneNumber, email })
        const userInstance = await newUser.save()

        const payload = createPayload(userInstance)
        const jwt = 'Bearer ' + jwtGen(payload)

        return res.status(201).send({
            user: payload,
            token: jwt
        })
    } catch (err) {
        error(err)
        next(err)
    }
}

export default { login, signUp }