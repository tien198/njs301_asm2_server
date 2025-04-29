import { Router } from 'express'
import { error } from 'console'

import adminCtrls from '../../controllers/adminCtrls/index.js'

const router = Router()

router.get('/get-type-names-list', adminCtrls.getTypeNames)


export default router