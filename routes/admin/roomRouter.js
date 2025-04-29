import { Router } from 'express'
import adminCtrls from '../../controllers/adminCtrls/index.js'

const router = Router()

router.get('/get-room-titles-list', adminCtrls.getRoomTitlesList)

router.get('/get-rooms', adminCtrls.getRooms)

router.delete('/delete-room/:roomId', adminCtrls.deleteRoom)

router.post('/add-room', adminCtrls.addRoom)


export default router