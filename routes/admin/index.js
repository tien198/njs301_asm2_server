import { Router } from 'express'

import isAuth from '../../middleware/isAuth.js'
import isAdmin from '../../middleware/isAdmin.js'

import dashboardRouter from './dashboardRouter.js'
import hotelRouter from './hotelRouter.js'
import roomRouter from './roomRouter.js'
import typeRouter from './typeRouter.js'
import transactionRouter from './transactionRouter.js'



const router = Router()


router.use(isAuth, isAdmin)

router.use(dashboardRouter, hotelRouter, roomRouter, typeRouter, transactionRouter)


export default router