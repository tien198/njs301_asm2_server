import { Router } from 'express'
import { error, log } from 'console'

import Transaction from '../models/transaction.js'

const router = Router()

router.post('/check-booked-rooms', async (req, res, next) => {
    try {
        const { hotelId } = req.body
        let { dateStart, dateEnd } = req.body

        dateStart = new Date(dateStart)
        dateEnd = new Date(dateEnd)
        if (Number.isNaN(dateStart.getTime()) || Number.isNaN(dateEnd.getTime()))
            throw Error('Invalid dateStart or dateEnd')

        const roomsFields = await Transaction.find({
            hotelId: hotelId,
            dateStart: { $gte: dateStart },
            dateEnd: { $lte: dateEnd }
        })
            .select('rooms -_id')
            .lean()
        const roomValues = roomsFields.reduce((acc, curr) =>
            [...acc, ...curr.rooms],
            []
        )
        // many Transactions (roomValues) may has the same 'roomId'
        // Group that into unique roomIds
        const roomIds = roomValues.map(i => i.roomId)
        const uniqueRoomIds = [...new Set(roomIds)]
        const roomGroupEntries = uniqueRoomIds.map(i => {
            const roomsGroup = roomValues.reduce((acc, curr) => {
                if (curr.roomId === i)
                    return [...acc, ...curr.roomNumbers]
            }, [])
            return [i, roomsGroup]
        })

        res.status(200).json(roomGroupEntries)
    } catch (err) {
        error(err)
        return next(err)
    }
})

//  booking <= ________________|start _________ <= booking <= ____________ | end

router.post('/add-transaction', async (req, res, next) => {
    try {
        const {
            user, hotelId, rooms,
            dateStart, dateEnd,
            price, payment
        } = req.body

        const exTrans = await Transaction.find({
            hotelId: hotelId,
            dateStart: { $gte: dateStart },
            dateEnd: { $lte: dateEnd }
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

