import ErrorRespone from '../../models/ErrorRespone.js'
import Hotel from '../../models/mogooseModels/Hotel.js'
import Room from '../../models/mogooseModels/Room.js'
import Transaction from '../../models/mogooseModels/Transaction.js'



async function getRoomTitles(req, res, next) {
    try {
        const rooms = await Room.find().select('title').lean()
        res.status(200).json(rooms)
    } catch (err) {
        next(err)
    }
}

async function getRooms(req, res, next) {
    try {
        const rooms = await Room.find().select('-roomNumber -createdAt -updatedAt -__v').lean()
        res.status(200).json(rooms)
    } catch (err) {
        next(err)
    }
}

async function deleteRoom(req, res, next) {
    try {
        const { roomId } = req.params

        if (!roomId)
            throw new ErrorRespone('Uri must have \'roomId\' param!', 400)

        const delRoom = await Room.findOne({ _id: roomId })
        const isAnyBooked = await Transaction.findOne({
            rooms: { $elemMatch: { roomId: delRoom._id } },
            status: { $ne: 'Checkout' }
        })
        if (isAnyBooked)
            throw new ErrorRespone('The room was booked at the time!', 400, { wasBooked: true })

        const delResult = await delRoom.deleteOne()
        if (!delResult.acknowledged && delResult.deletedCount === 0)
            throw new ErrorRespone('Deleted room does not exist!', 500)

        res.status(200).json({ message: 'Room was deleted successfully' })
    } catch (err) {
        next(err)
    }
}

async function addRoom(req, res, next) {
    try {
        // req.body is { ...RoomSchema, hotelId}
        const room = req.body
        const hotelId = room.hotelId
        if (!hotelId)
            throw new ErrorRespone('request body must have \'hotelId\' field!', 400)

        // the defined hotel to add room to
        const hotel = await Hotel.findOne({ _id: hotelId })
        if (!hotel)
            throw new ErrorRespone(`Not found hotel has id: ${hotelId}!`, 404)

        const createdRoom = await Room.create({ ...room })
        hotel.rooms = [...hotel.rooms, createdRoom._id.toString()]
        const savedHotel = await hotel.save()
        if (!savedHotel)
            throw new ErrorRespone(`Couldn't add created room to defined hotel! Please add room to hotel manually!`)

        res.status(200).json({ message: `Successfully! Room was create with id: ${created._id} and added to ${hotel.name.toUpperCase()} hotel!` })
    } catch (error) {
        next(error)
    }
}

export default { getRoomTitles, getRooms, deleteRoom, addRoom }