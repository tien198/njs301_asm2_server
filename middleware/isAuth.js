import JwtPayload from '../models/dataModels/jwtPayload.js'
import { jwtVerify } from '../utilities/jwtToken.js';

export default async function isAuth(req, res, next) {
    try {
        const jwt = req.headers.authorization;
        if (!jwt)
            throw { status: 401, message: 'Unauthorized' }

        // Verify the token
        const token = jwt.split(" ")[1];
        const decoded = await jwtVerify(token)

        req.user = JwtPayload.fromObject(decoded)
        next()

    } catch (error) {
        next(error)
    }
}