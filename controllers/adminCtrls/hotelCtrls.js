import Hotel from "../../models/mogooseModels/Hotel.js"
import Transaction from '../../models/mogooseModels/Transaction.js'
import ErrorResponse from '../../models/ErrorRespone.js'


export async function getHotelCount(req, res, next) {
    try {
        const count = await Hotel.countDocuments()
        res.status(200).json(count)
    } catch (err) {
        next(err)
    }
}

// api: GET /admin/get-hotels
// query: page=0&limit=10
export async function getHotels(req, res, next) {
    const page = +req.query.page || 0
    const docsPerPage = +req.query['limit'] || 10

    try {
        const hotels = await Hotel.find()
            .skip(page * docsPerPage).limit(docsPerPage)
            .select('name type city').lean()
        res.status(200).json(hotels)
    } catch (err) {
        next(err)
    }
}

export async function deleteHotel(req, res, next) {
    const { hotelId } = req.params
    try {
        if (!hotelId)
            throw new ErrorResponse('Uri must have \'hotelId\' param!', 400)

        // check if hotel was booked
        const isAnyBooked = await Transaction.findOne({ hotelRef: hotelId, status: { $ne: 'Checkout' } }).lean()
        if (isAnyBooked)
            throw new ErrorResponse('The hotel was booked at the time!', 400, { wasBooked: true })

        const deleteResult = await Hotel.deleteOne({ _id: hotelId })
        if (!deleteResult.acknowledged)
            throw new ErrorResponse('Delete failed!', 500)

        res.status(200).json(deleteResult.acknowledged)
    } catch (err) {
        next(err)
    }
}

// req.body: { ...Hotel.schema }
export async function addHotel(req, res, next) {
    const hotel = req.body

    try {
        if (!hotel)
            throw new ErrorRespone('Request body must have \'hotel\' field')
        const newHotel = new Hotel({ ...hotel })
        const success = await newHotel.save()
        res.status(200).json(`Hotel was created with id: ${success._id} `)
    } catch (err) {
        next(err)
    }
}

// api: GET /admin/get-hotel-names
// query: page=0&limit=10
export async function getHotelNames(req, res, next) {
    const page = +req.query.page || 0
    const docsPerPage = +req.query['limit'] || 10

    try {
        const hotels = await Hotel.find()
            .skip(page * docsPerPage).limit(docsPerPage)
            .select('name').lean()
        res.status(200).json(hotels)
    } catch (err) {
        next(err)
    }
}


export default { getHotelCount, getHotels, deleteHotel, addHotel, getHotelNames }