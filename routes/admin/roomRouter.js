import { Router } from 'express'
import adminCtrls from '../../controllers/adminCtrls/index.js'

const router = Router()

router.get('/get-room-titles-list', adminCtrls.getRoomTitlesList)

export default router