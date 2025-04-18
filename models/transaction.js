import Mongoose, { Schema } from 'mongoose';

const nestedRoom = {
    roomId: String,
    roomNumbers: [String]
}

const transactionSchema = new Schema({
    user: {
        userId: { type: Schema.Types.ObjectId, require: true, ref: 'User' },
        userName: { type: String, require: true },

    },
    hotelId: { type: String, require: true },
    rooms: [nestedRoom],
    startDate: { type: Date, require: true },
    endDate: { type: Date, require: true },
    price: { type: Number, require: true },
    payment: { type: String, enum: ['Credit', 'Card', 'Cash'], require: true },
    status: { type: String, enum: ['Booked', 'Checkin', 'Checkout'], default: 'Booked' }
})

export default Mongoose.model('Transaction', transactionSchema)