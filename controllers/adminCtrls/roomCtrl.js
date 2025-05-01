import ErrorRespone from '../../models/ErrorRespone.js'
import Hotel from '../../models/mogooseModels/Hotel.js'
import Room from '../../models/mogooseModels/Room.js'
import Transaction from '../../models/mogooseModels/Transaction.js'


// query: page=0&limit=10
async function getRoomTitles(req, res, next) {
    try {
        const page = +req.query.page || 0
        const limit = +req.query.limit || 10

        const rooms = await Room.find()
            .skip(page * limit).limit(limit)
            .select('title').lean()
        res.status(200).json(rooms)
    } catch (err) {
        next(err)
    }
}

// query: page=0&limit=10
async function getRooms(req, res, next) {
    try {
        const page = +req.query.page || 0
        const limit = +req.query.limit || 10

        const rooms = await Room.find()
            .skip(page * limit).limit(limit)
            .select('-roomNumber -createdAt -updatedAt -__v').lean()
        res.status(200).json(rooms)
    } catch (err) {
        next(err)
    }
}

// param - roomId:string
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

// req.body: { ...Room.Schema, hotelId}
async function addRoom(req, res, next) {
    try {
        // req.body is { ...Room.Schema, hotelId}
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

        res.status(200).json({ message: `Successfully! Room was create with id: ${createdRoom._id} and added to ${hotel.name.toUpperCase()} hotel!` })
    } catch (error) {
        next(error)
    }
}

export default { getRoomTitles, getRooms, deleteRoom, addRoom }