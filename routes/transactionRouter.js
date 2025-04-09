import { Router } from 'express'
import { error, log } from 'console'

import Transaction from '../models/transaction.js'

const router = Router()

router.post('/find-transactions', async (req, res, next) => {
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

router.post('/add-transaction', async (req, res, next) => {
    try {
        const {
            user, hotelId, rooms,
            dateStart, dateEnd,
            price, payment
        } = req.body

        const exTrans = await Transaction.find({
            hotelId: hotelId,
            dateStart: { $lte: dateStart },
            dateEnd: { $gte: dateEnd }
        }).lean()

        const roomsInBookingTime = exTrans.reduce((acc, curr) =>
            [...acc, ...curr.rooms],
            [] // reduce initial value
        )

        for (const r of rooms) {
            if (roomsInBookingTime.includes(r)) {
                throw Error(`Room was booked!`)
            }
        }

        await Transaction.insertOne({ user, hotelId, rooms, dateStart, dateEnd, price, payment })
        return res.status(201).json('Booking success!')

    } catch (err) {
        error(err)
        return next(err)
    }
})

export default router