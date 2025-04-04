import { error, log } from 'console'

import Hotel from '../models/hotel.js';
import { getHotelsCol } from '../utils/mogoClient.js'


export function getHotels(req, res) {
    Hotel.find()
        .then(hotels => {
            res.status(200).json(hotels);
        })
        .catch(err => {
            error(err)
            res.status(500).json({ error: err });
        });
}

export function searchHotels(req, res) {
    const { city, roomsTotal, checkInDate, minPrice, maxPrice } = req.body

    
    getHotelsCol().aggregate([
        {
            $match: {
                $expr: {
                    $and: [
                        { $isArray: '$rooms' },
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
                                $in: [
                                    '$_id',
                                    {
                                        $map: {
                                            input: '$$hotel_rooms',
                                            // as: 'roomId',
                                            in: { $toObjectId: '$$this' }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                ],
                as: 'roomsList'
            }
        },
        // Phần này cần thêm lọc theo: checkInDate, minPrice, maxPrice 
        { $project: { 'roomsList': 0 } }
    ]).toArray()
        .then(searched =>
            res.status(200).json({
                total: searched.length,
                res: searched
            })
        )
        .catch(err => {
            err && error(err)
            res.status(400).send('Couldn\'t find rooms!')
        })
}

export default { getHotels, searchHotels }