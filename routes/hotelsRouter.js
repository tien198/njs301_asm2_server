import { Router } from 'express';
import { error } from 'console';

import hotelCtrl from '../controllers/hotelCtrl.js'

const router = Router();

router.get('/hotels', hotelCtrl.getHotels)

export default router