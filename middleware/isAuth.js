import { jwtVerify } from '../utils/jwtToken.js';

export default function isAuth(req, res, next) {
    const jwt = req.headers.authorization;
    if (!jwt)
        res.status(401).send("Unauthorized")

    // Verify the token
    const token = jwt.split(" ")[1];
    jwtVerify(token)
        .then((decoded) => {
            req.user = decoded
            next()
        })
        .catch((err) => res.status(401).send("Unauthorized"))
}