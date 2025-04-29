import Room from '../../models/mogooseModels/Room.js'
import Transaction from '../../models/mogooseModels/Transaction.js'



async function getRoomTitlesList(req, res, next) {
    try {
        const rooms = await Room.find().select('title').lean()
        res.status(200).json(rooms)
    } catch (err) {
        next(err)
    }
}

async function getRooms(req, res, next) {
    try {
        const rooms = await Room.find().select('-roomNumber').lean()
        res.status(200).json(rooms)
    } catch (err) {
        next(err)
    }
}

async function deleteRoom(req, res, next) {
    try {
        const { id } = req.params
        const delRoom = await Room.findOne(id)
        const isAnyBooked = Transaction.findOne({
            rooms: { $elemMatch: { roomId: delRoom._id } },
            status: { $ne: 'Checkout' }
        })
        if (isAnyBooked)
            throw new ErrorResponse('The room was booked at the time!', 400, { wasBooked: true })

        const delResult = await delRoom.deleteOne()
        if (!delResult.acknowledged && delResult.deletedCount === 0)
            throw new ErrorResponse('Deleted room does not exist!', 500)

        res.status(200).json({ message: 'Room deleted successfully' })
    } catch (err) {
        next(err)
    }
}


export default { getRoomTitlesList, getRooms, deleteRoom }