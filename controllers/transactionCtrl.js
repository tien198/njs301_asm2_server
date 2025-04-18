import { error, log } from 'console'
import { ObjectId } from 'mongodb'

import Transaction from '../models/transaction.js'

import { groupRooms } from './utils/transactionUtils.js'



export async function checkBookedRooms(req, res, next) {
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
        const existRooms = exTrans.reduce((acc, curr) =>
            [...acc, ...curr.rooms],
            []
        )
        // many Transactions (existRooms) may has the same 'roomId'
        // Group that into unique roomIds
        const roomIds = existRooms.map(i => i.roomId)
        const uniqueRoomIds = [...new Set(roomIds)]

        // { groupRooms } from ./utils/transactionUtils.js
        const roomGroups = groupRooms(uniqueRoomIds, existRooms)

        res.status(200).json(roomGroups)
    } catch (err) {
        error(err)
        return next(err)
    }
}

//  booking <= ________________|start _________ <= booking <= ____________ | end

export async function addTransaction(req, res, next) {
    try {
        const {
            user, hotelRef, rooms: reqRooms,
            startDate, endDate,
            price, payment
        } = req.body

        const exTrans = await Transaction.find({
            hotelRef: hotelRef,
            startDate: { $gte: startDate },
            endDate: { $lte: endDate }
        })
            .select('rooms -_id')
            .lean()
        const existRooms = exTrans.reduce((acc, curr) =>
            [...acc, ...curr.rooms],
            []
        )
        // many Transactions (existRooms) may has the same 'roomId'
        // Group that into unique roomIds
        const roomIds = existRooms.map(i => i.roomId)
        const uniqueRoomIds = [...new Set(roomIds)]

        // { groupRooms } from ./utils/transactionUtils.js
        const roomGroups = groupRooms(uniqueRoomIds, existRooms)

        if (roomGroups.length > 0) {
            // check the exist roomId and roomNumbers
            reqRooms.forEach(room => {
                const bookedRoom = roomGroups
                    .find(r => r.roomId === room.roomId)
                // is exist room?
                if (!bookedRoom)
                    return false

                // is exist any roomNumbers?
                const bookedRoomNumbers = bookedRoom.roomNumbers

                if (uniqueRoomIds.includes(room.roomId)) {
                    room.roomNumbers.forEach(rNum => {
                        if (bookedRoomNumbers.includes(rNum.toString()))
                            // throw if any exist
                            throw Error('There is some rooms was booked at the time!')
                    });
                }
            });
        }

        const userObj = {
            userRef: ObjectId.createFromHexString(user.userRef),
            userName: user.userName
        }
        const hotelRefCasted = ObjectId.createFromHexString(hotelRef)

        await Transaction.insertOne({
            user: userObj, hotelRef: hotelRefCasted, rooms: reqRooms,
            startDate, endDate, price, payment
        })
        return res.status(201).json('Booking success!')

    } catch (err) {
        return next(err)
    }
}

// get Transaction according userId
export async function getTransactions(req, res, next) {
    try {
        const { userId } = req.body
        // if using populate query in nested doc
        // const trans = await Transaction.find({ 'user.userId': userId }).populate('user.userId', 'userName')
        const trans = await Transaction.find({ 'user.userRef': userId }).populate('hotelRef', '-_id name')

        res.status(200).json(trans)

    } catch (err) {
        next(err)
    }
}


export default { checkBookedRooms, addTransaction, getTransactions }