import { error, log } from 'console'

import Hotel from '../models/mogooseModels/Hotel.js';
import { getHotelsCol } from '../utilities/mogoClient.js'

import { ObjectId } from 'mongodb'



export async function getHotels(req, res, next) {
    try {
        const page = +req.query.page || 0
        const docsPerPage = +req.query.docsPerPage || 4

        const skipTotal = page * docsPerPage
        const hotels = await Hotel.find().skip(skipTotal).limit(docsPerPage).select('name type cheapestPrice rating type photos').lean()
        res.status(200).json(hotels)
    }
    catch (err) {
        next(err)
    }
}

export async function getHotel(req, res, next) {
    const hotelId = req.params.hotelId
    try {
        const aggregate = await Hotel.aggregate([
            {
                $match: { _id: ObjectId.createFromHexString(hotelId) }
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
            }
        ])
        const hotel = aggregate[0]
        return res.status(200).json(hotel)

    } catch (err) {
        error(err); next(err)
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