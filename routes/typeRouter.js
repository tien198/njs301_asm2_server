import { Router } from 'express'

import typeCtrl from '../controllers/typeCtrl.js'

const router = Router()

router.get('/get-type-names', typeCtrl.getTypeNames)

router.get('/types', typeCtrl.getTypes)


export default router