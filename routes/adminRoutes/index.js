import { Router } from 'express'

import isAuth from '../../middleware/isAuth.js'
import isAdmin from '../../middleware/isAdmin.js'

import dashboard from './dashboard.js'
import hotelManagement from './hotelManagement.js'



const router = Router()


router.use(isAuth, isAdmin)

router.use(dashboard, hotelManagement)


export default router