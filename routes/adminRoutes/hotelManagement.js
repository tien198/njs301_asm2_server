import { Router } from 'express'

import adminCtrls from '../../controllers/adminCtrls/index.js'

const router = Router()


router.get('/get-hotel-count', adminCtrls.getHotelCount)

export default router