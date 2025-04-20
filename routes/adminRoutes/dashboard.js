import { Router } from 'express'

import isAuth from '../../middleware/isAuth.js'
import isAdmin from '../../middleware/isAdmin.js'

import adminCtrls from '../../controllers/adminCtrls/index.js'

import User from '../../models/user.js'
import Transaction from '../../models/transaction.js'

const router = Router()

router.use([isAuth, isAdmin])



router.get('/get-users-total', adminCtrls.getUsersTotal)

router.get('/get-transactions-total', adminCtrls.getTransactionsTotal)

router.get('/get-revenue-total', adminCtrls.getRevenueTotal)

router.get('/get-balance', adminCtrls.getBalance)

router.get('/last-transactions', adminCtrls.getLastTransactions)


export default router