import { Router } from 'express'
import { log } from 'console'

import authenCtrl from '../controllers/authenCtrl.js'

const authenRout = Router()

authenRout.post('/login', authenCtrl.login)

authenRout.post('/sign-up', authenCtrl.signUp)

export default authenRout