import { Router } from 'express'

import adminCtrls from '../../controllers/adminCtrls/index.js'


const router = Router()


router.get('/get-hotel-count', adminCtrls.getHotelCount)

// query: page=0&docs-per-page=10
router.get('/get-hotels', adminCtrls.getHotels)

router.delete('/delete-hotel/:hotelId', adminCtrls.deleteHotel)

router.post('/add-hotel', adminCtrls.addHotel)

export default router