import Mongoose, { Schema } from 'mongoose';

const transactionSchema = new Schema({
    user: { type: String, require: true },
    hotelId: { type: String, require: true },
    room: { type: [String] },
    dateStart: { type: String, require: true },
    dateEnd: { type: String, require: true },
    price: { type: Number, require: true },
    payment: { type: String, enum: ['Credit', 'Card', 'Cash'], require: true },
    status: { type: String, enum: ['Booked', 'Checkin', 'Checkout'], require: true }
})

export default Mongoose.model('Transaction', transactionSchema)