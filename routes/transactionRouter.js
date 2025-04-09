import { Router } from 'express'
import { error, log } from 'console'

import Transaction from '../models/transaction.js'

const router = Router()

router.post('/find-transaction', async (req, res, next) => {
    try {
        const { hotelId } = req.body
        let { dateStart, dateEnd } = req.body

        dateStart = new Date(dateStart)
        dateEnd = new Date(dateEnd)
        if (Number.isNaN(dateStart.getTime()) || Number.isNaN(dateEnd.getTime()))
            throw Error('Invalid dateStart or dateEnd')

        const transactions = await Transaction.find({
            hotelId: hotelId,
            dateStart: { $gte: dateStart },
            dateEnd: { $lte: dateEnd }
        })
        res.status(200).json(transactions)
    } catch (err) {
        error(err)
        return next(err)
    }
})

export default router