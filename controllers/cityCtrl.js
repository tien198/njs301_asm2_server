import City from '../models/city.js'

export function getCities(req, res) {
    City.find()
        .then(cities => {
            res.status(200).json(cities)
        })
        .catch(err => {
            error(err)
            res.status(500).json({ error: err });
        })
}

export default { getCities }