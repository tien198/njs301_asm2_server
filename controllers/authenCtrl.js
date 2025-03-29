import { hashSync, compareSync } from 'bcrypt'
import { log } from 'console';

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

            return res.status(202).send(jwt)
        })
}

export function signUp(req, res, next) {
    const { userName, password, fullName, phoneNumber, email } = req.body
    const hash = hashSync(password, 12)
    User.findOne({ userName })
        .then(user => {
            if (user)
                return res.status(400).send('User existed')
            const newUser = new User({ userName, password: hash, fullName, phoneNumber, email })
            newUser.save()
                .then(() => {
                    return res.status(201).send('Created!')
                })
                .catch(err => {
                    log(err)
                    res.status(400).send(err)
                })
        })
}

export default { login, signUp }