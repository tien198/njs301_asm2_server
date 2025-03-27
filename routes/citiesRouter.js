import { Router } from 'express';
import { error, log } from 'console'

import City from '../models/city.js'

const router = Router();

router.get('/cities', (req, res) => {
    City.find()
        .then(cities => {
            res.status(200).json(cities)
        })
        .catch(err => {
            error(err)
            res.status(500).json({ error: err });
        })
})

export default router