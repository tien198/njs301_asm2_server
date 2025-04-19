import ErrorRespone from '../models/dataModels/errorRespone.js'

export default function isAdmin(req, res, next) {
    try {
        const isAdmin = req.user?.isAdmin
        if (!isAdmin)
            throw new ErrorRespone('Unauthorized ! Permission denied !', 401)

        next()
    } catch (error) {
        next(error)
    }
}