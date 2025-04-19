export default class ErrorRespone {
    status
    message
    errors = {}

    /**
     * @param {string} msg - message of error
     * @param {number} status - status of error
     * @param {object} errors - an object that contain detail of errors present by key-value pairs
     * exp: errors = { 
     *   credential: 'wrong password or username',
     *   ...
     * }
     */
    constructor(msg, status, errors) {
        this.message = msg ?? 'Internal Server Error !'
        this.status = status ?? 500
        this.errors = errors 
    }
}