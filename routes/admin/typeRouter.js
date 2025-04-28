import { Router } from 'express'
import { error } from 'console'

import adminCtrls from '../../controllers/adminCtrls/index.js'

const router = Router()

router.get('/get-types', adminCtrls.getTypes)

export default router