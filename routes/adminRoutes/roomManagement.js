import { Router } from 'express'
import Room from '../../models/mogooseModels/Room.js'

const router = Router()

router.get('/get-rooms-list', async function (req, res, next) {
    try {
        const rooms = await Room.find().select('title').lean()
        res.status(200).json(rooms)
    } catch (err) {
        next(err)
    }
})

export default router