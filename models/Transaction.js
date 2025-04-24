import Mongoose, { Schema } from 'mongoose';

const nestedRoom = {
    roomId: String,
    roomNumbers: [String]
}

const transactionSchema = new Schema({
    user: {
        userRef: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
        userName: { type: String, required: true },

    },
    hotelRef: { type: Schema.Types.ObjectId, required: true, ref: 'Hotel' },
    rooms: [nestedRoom],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    price: { type: Number, required: true },
    payment: { type: String, enum: ['Credit', 'Card', 'Cash'], required: true },
    status: { type: String, enum: ['Booked', 'Checkin', 'Checkout'], default: 'Booked' }
})

export default Mongoose.model('Transaction', transactionSchema)