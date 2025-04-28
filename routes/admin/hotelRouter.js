import { Router } from 'express'
import { log } from 'console'

import adminCtrls from '../../controllers/adminCtrls/index.js'
import Hotel from '../../models/mogooseModels/Hotel.js'
import ErrorRespone from '../../models/ErrorRespone.js'


const router = Router()


router.get('/get-hotel-count', adminCtrls.getHotelCount)

router.get('/get-hotels', adminCtrls.getHotels)

router.delete('/delete-hotel/:hotelId', adminCtrls.deleteHotel)

router.post('/add-hotel', adminCtrls.addHotel)

export default router