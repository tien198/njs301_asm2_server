export default class ErrorRespone {
    status = 500
    message = 'Internal Server Error !'
    errors = {}

    /**
     * @param {string} msg - message of error
     * @param {number} status - status of error
     * @param {object} errors - an object that contain detail of errors present by key-value
     * exp: errors = { 
     *   credential: 'wrong password or username',
     *   ...
     * }
     */
    constructor(msg, status, errors) {
        this.message = msg
        this.status = status
        this.errors = errors
    }
}