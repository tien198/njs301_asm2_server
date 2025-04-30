import { Router } from 'express'

import hotelCtrl from '../controllers/hotelCtrl.js'



const router = Router()

// query: /?page=0 & limit=10
router.get('/hotels', hotelCtrl.getHotels)

router.get('/hotel/:hotelId', hotelCtrl.getHotel)

router.post('/search-hotels', hotelCtrl.searchHotels)

export default router