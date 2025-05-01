import { Router } from 'express'
import adminCtrls from '../../controllers/adminCtrls/index.js'

const router = Router()

// query: page=0&limit=10
router.get('/get-room-titles', adminCtrls.getRoomTitles)

// query: page=0&limit=10
router.get('/get-rooms', adminCtrls.getRooms)

router.delete('/delete-room/:roomId', adminCtrls.deleteRoom)

// req.body: { ...Room.Schema, hotelId}
router.post('/add-room', adminCtrls.addRoom)


export default router