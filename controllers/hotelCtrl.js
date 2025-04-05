import { error, log } from 'console'

import Hotel from '../models/hotel.js';
import { getHotelsCol } from '../utils/mogoClient.js'

import { ObjectId } from 'mongodb'


export function getHotels(req, res, next) {
    Hotel.find()
        .then(hotels => {
            res.status(200).json(hotels);
        })
        .catch(err => {
            error(err); next(err)
        });
}

export async function getHotel(req, res, next) {
    const hotelId = req.params.hotelId
    try {
        const hotel = await Hotel.findById(hotelId)
        if (hotel)
            return res.status(200).json(hotel)
    } catch (err) {
        error(err)
        const errRs = {
            status: 404, message: `Could't find hotel with id: ${hotelId}`
        }
        next(errRs)
    }

}

export function searchHotels(req, res, next) {
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
            const errRs = {
                status: 400, message: 'Couldn\'t find rooms!'
            }
            next(errRs)
        })
}

export default { getHotels, getHotel, searchHotels }