import Mongoose, { Schema } from 'mongoose';

const roomSchema = new Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    maxPeople: { type: Number},
    desc: { type: String },
    roomNumber: { type: Number, required: true },
    // booked
})

export default Mongoose.model('Room', roomSchema)