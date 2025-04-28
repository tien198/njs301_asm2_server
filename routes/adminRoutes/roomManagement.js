import { Router } from 'express'
import Room from '../../models/mogooseModels/Room'

const router = Router()

router.get('/rooms', async function (req, res, next) {
    try {
        const rooms = await Room.find().lean()
        res.status(200).json(rooms)
    } catch (err) {
        next(err)
    }
})