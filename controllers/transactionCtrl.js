import { error, log } from 'console'
import { ObjectId } from 'mongodb'

import Transaction from '../models/mogooseModels/Transaction.js'

import { groupRooms } from './utils/transactionUtils.js'
import ErrorRespone from '../models/ErrorRespone.js'



export async function checkBookedRooms(req, res, next) {
    try {
        const { hotelId } = req.body
        let { startDate, endDate } = req.body

        startDate = new Date(startDate)
        endDate = new Date(endDate)
        if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()))
            throw Error('Invalid startDate or endDate')

        const exTrans = await Transaction.find({
            hotelRef: hotelId,
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
        return next(err)
    }
}

//  booking <= ________________|start _________ <= booking <= ____________ | end

export async function addTransaction(req, res, next) {
    try {
        const {
            user, hotelId, rooms: reqRooms,
            startDate, endDate,
            price, payment
        } = req.body

        const exTrans = await Transaction.find({
            hotelRef: hotelId,
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
            userRef: user.userId,
            userName: user.userName
        }

        await Transaction.create({
            user: userObj, rooms: reqRooms,
            hotelRef: hotelId,
            startDate, endDate, price, payment
        })
        return res.status(201).json('Booking success!')

    } catch (err) {
        return next(err)
    }
}

// get Transaction according userId
// api: POST /get-transactions
// body: { userId: String }, query: page=0 & docs-per-page=10
export async function getTransactions(req, res, next) {
    try {
        const { userId } = req.body
        const page = +req.query.page || 0
        const docsPerPage = +req.query['docs-per-page'] || 10

        if (!userId)
            throw new ErrorRespone(`request body must have 'userId' field`, 400)

        const trans = await Transaction.find({ 'user.userRef': userId })
            .skip(page * docsPerPage).limit(docsPerPage)
            .populate('hotelRef', '-_id name').select('-user').lean()

        res.status(200).json(trans)

    } catch (err) {
        next(err)
    }
}


export default { checkBookedRooms, addTransaction, getTransactions }