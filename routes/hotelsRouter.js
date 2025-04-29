import { Router } from 'express'
import { error } from 'console'

import hotelCtrl, { getHotels } from '../controllers/hotelCtrl.js'

// import Hotel from '../models/hotel.js'

const router = Router()

// query: /?page=0 & docs-per-page=10
router.get('/hotels', hotelCtrl.getHotels)

router.get('/hotel/:hotelId', hotelCtrl.getHotel)

router.post('/search-hotels', hotelCtrl.searchHotels)

export default router