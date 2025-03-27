import { Router } from 'express'
import {error} from 'console'

import Type from '../models/type.js';

const router = Router()

router.get('/types', (req, res) => {
    Type.find()
        .then(types => res.status(200).json(types))
        .catch(err => {
            error(err)
            res.status(500).json({ error: err });
        })
})

export default router