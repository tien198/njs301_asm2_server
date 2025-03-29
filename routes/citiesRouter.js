import { Router } from 'express';
import { error, log } from 'console'

import cityCtrl from '../controllers/cityCtrl.js'

const router = Router();

router.get('/cities', cityCtrl.getCities)

export default router