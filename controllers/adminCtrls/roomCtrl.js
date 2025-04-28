import Room from '../../models/mogooseModels/Room.js'



async function getRoomTitlesList(req, res, next) {
    try {
        const rooms = await Room.find().select('title').lean()
        res.status(200).json(rooms)
    } catch (err) {
        next(err)
    }
}


export default { getRoomTitlesList }