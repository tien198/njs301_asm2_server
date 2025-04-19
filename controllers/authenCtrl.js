import { hashSync, compareSync } from 'bcrypt'
import { log, error } from 'console';

import User from '../models/user.js'
import JwtPayload from '../models/dataModels/jwtPayload.js'
import ErrorRespone from '../models/dataModels/errorRespone.js'
import { jwtGen } from '../utilities/jwtToken.js';



export async function login(req, res, next) {
    const { userName, password } = req.body
    try {
        let user = await User.findOne({ userName }).lean()

        if (!user) user = await User.findOne({ email: userName })

        if (!user || !compareSync(password, user.password)) {
            const errors = { credential: 'wrong password or username' }
            throw new ErrorRespone('Fail to login', 401, errors)
        }

        if (user) {
            const payload = JwtPayload.fromUserModel(user)
            const jwt = 'Bearer ' + jwtGen({ ...payload })
            return res.status(202).json({
                user: payload,
                token: jwt
            })
        }
    } catch (error) {
        next(error)
    }
}

export async function signUp(req, res, next) {
    try {
        const { userName, password, fullName, phoneNumber, email: inputEmail } = req.body
        // allow login by email or userName
        const email = inputEmail || userName

        const hash = hashSync(password, 12)
        let errors = {}
        const user = await User.findOne({ userName })
        if (user)
            errors.userName = 'UserName existed'

        if (password.length < 6)
            errors.password = 'Password must be at least 6 characters'

        if (Object.keys(errors).length > 0)
            throw new ErrorRespone('Fail to create user', 422, errors)

        const newUser = new User({ userName, password: hash, fullName, phoneNumber, email })
        const userInstance = await newUser.save()

        const payload = JwtPayload.fromUserModel(userInstance)
        const jwt = 'Bearer ' + jwtGen({ ...payload })

        return res.status(201).send({
            user: payload,
            token: jwt
        })
    } catch (error) {
        next(error)
    }
}

export default { login, signUp }