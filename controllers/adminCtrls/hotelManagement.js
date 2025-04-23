import Hotel from "../../models/Hotel.js"

export async function getHotelCount(req, res, next) {
    try {
        const count = await Hotel.countDocuments()
        res.status(200).json(count)
    } catch (err) {
        next(err)
    }
}

export async function getHotels(req, res, next) {
    const page = +req.query.page ?? 0
    const docsPerPage = +req.query ?? 10

    try {
        const hotels = await Hotel.find()
            .skip(page * docsPerPage).limit(docsPerPage)
            .select('name type city').lean()
        res.status(200).json(hotels)
    } catch (err) {
        next(err)
    }
}

export default { getHotelCount, getHotels }