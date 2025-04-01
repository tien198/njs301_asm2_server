import { Router } from 'express'
import hotelCtrl, { getHotels } from '../controllers/hotelCtrl.js'

const router = Router()

router.get('/hotels', hotelCtrl.getHotels)

router.post('/search-hotels', hotelCtrl.searchHotels)

export default router