export default class JwtPayload {
    userId
    userName
    fullName
    phoneNumber
    email
    isAdmin

    static fromUserModel(user) {
        const payload = new JwtPayload()
        for (const key in payload) {
            payload[key] = user[key]
        }
        payload.userId = user._id

        return payload
    }

    static fromObject(obj) {
        const payload = new JwtPayload()
        for (const key in obj) {
            payload[key] = obj[key]
        }

        return payload
    }
}