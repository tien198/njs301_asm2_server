import { Router } from 'express'
import { error, log } from 'console'

import Transaction from '../models/transaction.js'

const router = Router()

router.post('/check-booked-rooms', async (req, res, next) => {
    try {
        const { hotelId } = req.body
        let { startDate, endDate } = req.body

        startDate = new Date(startDate)
        endDate = new Date(endDate)
        if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()))
            throw Error('Invalid startDate or endDate')

        const exTrans = await Transaction.find({
            hotelId: hotelId,
            startDate: { $gte: startDate },
            endDate: { $lte: endDate }
        })
            .select('rooms -_id')
            .lean()
        const roomValues = exTrans.reduce((acc, curr) =>
            [...acc, ...curr.rooms],
            []
        )
        // many Transactions (roomValues) may has the same 'roomId'
        // Group that into unique roomIds
        const roomIds = roomValues.map(i => i.roomId)
        const uniqueRoomIds = [...new Set(roomIds)]
        const roomGroups = uniqueRoomIds.map(i => {
            const groupedRoomNums = roomValues.reduce((acc, curr) => {
                if (curr.roomId === i)
                    return [...acc, ...curr.roomNumbers]
            }, [])
            return {
                roomId: i,
                roomNumbers: groupedRoomNums
            }
        })

        res.status(200).json(roomGroups)
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
            startDate, endDate,
            price, payment
        } = req.body

        const exTrans = await Transaction.find({
            hotelId: hotelId,
            startDate: { $gte: startDate },
            endDate: { $lte: endDate }
        })
            .select('rooms -_id')
            .lean()
        const roomValues = exTrans.reduce((acc, curr) =>
            [...acc, ...curr.rooms],
            []
        )
        // many Transactions (roomValues) may has the same 'roomId'
        // Group that into unique roomIds
        const roomIds = roomValues.map(i => i.roomId)
        const uniqueRoomIds = [...new Set(roomIds)]
        const roomGroups = uniqueRoomIds.map(i => {
            const groupedRoomNums = roomValues.reduce((acc, curr) => {
                if (curr.roomId === i)
                    return [...acc, ...curr.roomNumbers]
            }, [])
            return {
                roomId: i,
                roomNumbers: groupedRoomNums
            }
        })
        if (roomGroups.length > 0) {
            // check the exist roomId and roomNumbers
            rooms.forEach(room => {
                const bookedRoomNumbers = roomGroups
                    .find(r => r.roomId === room.roomId)
                    .roomNumbers

                if (uniqueRoomIds.includes(room.roomId)) {
                    room.roomNumbers.forEach(rNum => {
                        if (bookedRoomNumbers.includes(rNum))
                            throw Error('There is some rooms was booked at the time!')
                    });
                }
            });
        }


        await Transaction.insertOne({ user, hotelId, rooms, startDate, endDate, price, payment })
        return res.status(201).json('Booking success!')

    } catch (err) {
        return next(err)
    }
})

export default router

