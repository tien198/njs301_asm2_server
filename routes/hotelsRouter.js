import { Router } from 'express';
import { error } from 'console';

import hotelCtrl, { getHotels } from '../controllers/hotelCtrl.js'

import Hotel from '../models/hotel.js'
import Room from '../models/room.js'
import { getHotelsDb } from '../utils/mogoClient.js'

const router = Router();

router.get('/hotels', hotelCtrl.getHotels)

router.post('/search-hotels', (req, res) => {

    const { city, roomsTotal } = req.body
    Hotel.aggregate([
        {
            $match: {
                $expr: {
                    $and: [
                        { $gte: [{ $size: '$rooms' }, +roomsTotal] },
                        { $eq: ['$city', city] }
                    ]
                }
            }
        },
        {
            $lookup: {
                from: 'rooms',
                let: { hotel_rooms: '$rooms' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $in: [
                                            '$_id',
                                            {
                                                $map: {
                                                    input: '$$hotel_rooms',
                                                    as: 'roomId',
                                                    in: { $toObjectId: '$$roomId' }
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                ],
                as: 'roomsList'
            }
        },
        { $project: { 'city': 1, 'rooms': 1, 'roomsList': 1 } }
    ])
        .then(searched =>
            res.status(200).json({
                total: searched.length,
                res: searched
            })
        )
        .catch(err => {
            error(err)
            res.status(400).send('Couldn\'t find rooms!')
        })
})

export default router