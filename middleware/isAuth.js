import JwtPayload from '../models/dataModels/jwtPayload.js'
import ErrorRespone from '../models/dataModels/errorRespone.js'

import { jwtVerify } from '../utilities/jwtToken.js';

export default async function isAuth(req, res, next) {
    try {
        const jwt = req.headers.authorization;
        if (!jwt)
            throw new ErrorRespone('Unauthorized', 401)

        // Verify the token
        const token = jwt.split(" ")[1];
        const decoded = await jwtVerify(token)

        req.user = JwtPayload.fromObject(decoded)
        next()

    } catch (err) {
        err.status = 401
        next(err)
    }
}