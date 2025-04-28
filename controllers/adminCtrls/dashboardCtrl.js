import User from '../../models/mogooseModels/User.js'
import Transaction from '../../models/mogooseModels/Transaction.js'

export async function getUsersTotal(req, res, next) {
    try {
        const count = await User.countDocuments()
        res.status(200).json(count)
    }
    catch (err) {
        next(err)
    }
}

export async function getTransactionsTotal(req, res, next) {
    try {
        const count = await Transaction.countDocuments()
        res.status(200).json(count)
    }
    catch (err) {
        next(err)
    }
}

export async function getRevenueTotal(req, res, next) {
    try {
        const trans = await Transaction.find().select('price -_id').lean()
        const revenueTotal = trans.reduce((acc, curr) => acc + curr.price, 0)
        res.status(201).json(revenueTotal)
    } catch (err) {
        next(err)
    }
}

export async function getBalance(req, res, next) {
    try {
        const trans = await Transaction.find().select('price -_id').lean()
        const balance = trans.reduce((acc, curr) => acc + curr.price, 0)
        res.status(201).json(balance)
    } catch (err) {
        next(err)
    }
}

export async function getLastTransactions(req, res, next) {
    try {
        const lastTrans = await Transaction.find().sort({ _id: -1 }).limit(8).populate('hotelRef', '-_id name').lean()
        res.status(200).json(lastTrans)
    } catch (err) {
        next(err)
    }
}

export default { getUsersTotal, getTransactionsTotal, getRevenueTotal, getBalance, getLastTransactions }
