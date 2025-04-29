import ErrorRespone from '../models/ErrorRespone.js'

export default async function isAdmin(req, res, next) {
    try {
        const isAdmin = req.user?.isAdmin
        if (!isAdmin)
            throw new ErrorRespone('Unauthorized! Permission denied!', 401)

        next()
    } catch (err) {
        next(err)
    }
}