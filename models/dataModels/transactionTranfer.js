
export class RoomTranfer {
    /**
     * @param {string} roomId 
     * @param {string[]} roomNumbers 
     */
    constructor(roomId, roomNumbers) {
        this.roomId = roomId
        this.roomNumbers = roomNumbers
    }

    static fromObject(obj) {
        return new RoomTranfer(obj.roomId, obj.roomNumbers)
    }
}