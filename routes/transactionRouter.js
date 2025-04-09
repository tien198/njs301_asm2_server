import { Router } from 'express'
import { log } from 'console'

import Transaction from '../models/transaction.js'

const router = Router()

router.post('/find-transaction', (req, res, next) => {
    const { hotelId, dateStart, dateEnd } = req.body


    Transaction.find({
        hotelId: '6311a9c64a642f01423490bf',
        dateStart: ''
    })
    res.status(404).send('Not found!')
})

export default router