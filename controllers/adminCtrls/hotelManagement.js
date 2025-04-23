import hotel from "../../models/hotel.js"

export async function getHotelCount(req, res, next) {
    try {
        const count = await hotel.countDocuments()
        res.status(200).json(count)
    } catch (err) {
        next(err)
    }
}

export default { getHotelCount }