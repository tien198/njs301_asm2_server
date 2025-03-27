import { Router } from 'express';
import { error } from 'console';

import Hotel from '../models/hotel.js';

const router = Router();

router.get('/hotels', (req, res) => {
    Hotel.find()
        .then(hotels => {
            res.status(200).json(hotels);
        })
        .catch(err => {
            error(err)
            res.status(500).json({ error: err });
        });
})

export default router