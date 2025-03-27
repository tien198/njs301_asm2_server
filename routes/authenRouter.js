import { Router } from 'express'
import { log } from 'console'

import {login, signUp} from '../controllers/authenCtl.js'

const authenRout = Router()

authenRout.post('/login', login)

authenRout.post('/sign-up', signUp)

export default authenRout