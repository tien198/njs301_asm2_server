import { Router } from 'express'
import { error, log } from 'console'

import Transaction from '../models/transaction.js'
import { RoomTranfer } from '../models/dataModels/transactionTranfer.js'

const router = Router()

router.post('/check-booked-rooms', async (req, res, next) => {
    try {
        const { hotelId } = req.body
        let { dateStart, dateEnd } = req.body

        dateStart = new Date(dateStart)
        dateEnd = new Date(dateEnd)
        if (Number.isNaN(dateStart.getTime()) || Number.isNaN(dateEnd.getTime()))
            throw Error('Invalid dateStart or dateEnd')

        const exTrans = await Transaction.find({
            hotelId: hotelId,
            dateStart: { $gte: dateStart },
            dateEnd: { $lte: dateEnd }
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
            dateStart, dateEnd,
            price, payment
        } = req.body

        const exTrans = await Transaction.find({
            hotelId: hotelId,
            dateStart: { $gte: dateStart },
            dateEnd: { $lte: dateEnd }
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


        await Transaction.insertOne({ user, hotelId, rooms, dateStart, dateEnd, price, payment })
        return res.status(201).json('Booking success!')

    } catch (err) {
        error(err)
        return next(err)
    }
})

export default router

