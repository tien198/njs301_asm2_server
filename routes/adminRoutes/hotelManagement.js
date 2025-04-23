import { Router } from 'express'

import adminCtrls from '../../controllers/adminCtrls/index.js'
import Hotel from '../../models/Hotel.js'

const router = Router()


router.get('/get-hotel-count', adminCtrls.getHotelCount)

router.get('/get-hotels', adminCtrls.getHotels)

export default router