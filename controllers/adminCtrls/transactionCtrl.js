import { log } from "console"
import Transaction from "../../models/mogooseModels/Transaction.js"

// api: /admin/get-transactions
// query: page=0 & limit=10
export async function getTransations(req, res, next) {
    try {
        const page = +req.query.page || 0
        const docsPerPage = +req.query['limit'] || 10

        const trans = await Transaction.find()
            .sort({ _id: -1 }).skip(page * docsPerPage).limit(docsPerPage)
            .populate('hotelRef', '-_id name').lean()
        res.status(200).json(trans)

    } catch (error) {
        next(error)
    }
}



export default { getTransations }