import { hashSync, compareSync } from 'bcrypt'
import { log, error } from 'console';

import User from '../models/user.js'
import { jwtGen, jwtVerify } from '../utils/jwtToken.js';

export function login(req, res, next) {
    const { userName, password } = req.body
    User.findOne({ userName })
        .then(user => {
            if (!user || !compareSync(password, user.password))
                return res.status(401).send('Unauthorize!')

            const { userName, fullName, phoneNumber, email, isAdmin } = user
            const payload = {
                userName, fullName, phoneNumber, email, isAdmin
            }
            const jwt = 'Bearer ' + jwtGen(payload)

            return res.status(202).json({
                user: payload,
                token: jwt
            })
        })
}

export async function signUp(req, res, next) {
    const { userName, password, fullName, phoneNumber, email } = req.body
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
        await newUser.save()

        const payload = {
            userName, fullName, phoneNumber, email
        }
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