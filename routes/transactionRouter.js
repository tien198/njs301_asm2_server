import { Router } from 'express'

import tranCtrl from '../controllers/transactionCtrl.js'

const router = Router()

router.post('/check-booked-rooms', tranCtrl.checkBookedRooms)

router.post('/add-transaction', tranCtrl.addTransaction)

export default router
