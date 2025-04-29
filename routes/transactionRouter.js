import { Router } from 'express'

import tranCtrl from '../controllers/transactionCtrl.js'
import isAuth from '../middleware/isAuth.js'

const router = Router()

router.post('/check-booked-rooms', tranCtrl.checkBookedRooms)

router.use(isAuth)

// body: { userId: String }, query: page=0 & docsPerPage=10
router.post('/get-transactions', tranCtrl.getTransactions)

router.post('/add-transaction', tranCtrl.addTransaction)



export default router
