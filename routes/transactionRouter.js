import { Router } from 'express'

import Transaction from '../models/transaction.js'

import tranCtrl from '../controllers/transactionCtrl.js'

const router = Router()

router.post('/check-booked-rooms', tranCtrl.checkBookedRooms)

router.post('/add-transaction', tranCtrl.addTransaction)

// { userId: String }
router.post('/get-transactions', async function getTransactions(req, res, next) {
    try {
        const { userId } = req.body
        const trans = await Transaction.find({ 'user.userId': userId }).lean()
        res.status(200).json(trans)

    } catch (err) {
        next(err)
    }
})

export default router
