import Hotel from '../models/hotel.js';

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

export default { getHotels }