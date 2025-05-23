import { Router } from 'express'
import adminCtrls from '../../controllers/adminCtrls/index.js'

const router = Router()

// query: page=0 & limit=10
router.get('/get-transactions', adminCtrls.getTransations)

export default router