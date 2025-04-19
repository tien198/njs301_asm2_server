import User from '../../models/user.js'
import Transaction from '../../models/transaction.js'


export function getUsersTotal(req, res, next) {
    User.countDocuments()
        .then(count =>
            res.status(200).json({ count }))
        .catch(error =>
            next(error)
        )
}

export function getTransactionsTotal(req, res, next) {
    Transaction.countDocuments()
        .then(count =>
            res.status(200).json({ count }))
        .catch(error =>
            next(error)
        )
}

export function getRevenueTotal(req, res, next) {
    Transaction.countDocuments()
        .then(count =>
            res.status(200).json({ count }))
        .catch(error =>
            next(error)
        )
}


export default { getUsersTotal, getTransactionsTotal, getRevenueTotal }
