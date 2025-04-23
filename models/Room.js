import Mongoose, { Schema } from 'mongoose';

const roomSchema = new Schema({
    title: { type: String, require: true },
    price: { type: Number, require: true },
    maxPeople: { type: Number},
    desc: { type: String },
    roomNumber: { type: Number, require: true },
    // booked
})

export default Mongoose.model('Room', roomSchema)