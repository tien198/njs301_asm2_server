import { Router } from 'express'

import adminCtrls from '../../controllers/adminCtrls/index.js'


const router = Router()


router.get('/get-hotel-count', adminCtrls.getHotelCount)

// query: page=0&limit=10
router.get('/get-hotels', adminCtrls.getHotels)

// query: page=0&limit=10
router.get('/get-hotel-names', adminCtrls.getHotelNames)

router.delete('/delete-hotel/:hotelId', adminCtrls.deleteHotel)

router.post('/add-hotel', adminCtrls.addHotel)



export default router