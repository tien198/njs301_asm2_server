import { Router } from 'express'
import { error } from 'console'

import typeCtrl from '../controllers/typeCtrl.js'

const router = Router()

router.get('/types', typeCtrl.getTypes)

export default router