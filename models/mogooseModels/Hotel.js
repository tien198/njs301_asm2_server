import Mongoose, { Schema } from 'mongoose';

const hotelSchema = new Schema({
    name: { type: String, required: true },
    type: {
        type: String,
        enum: ['Hotel', 'Apartments', 'Resorts', 'Villas', 'Cabins'],
        required: true
    },
    city: { type: String, required: true },
    address: { type: String, required: true },
    distance: { type: Number, required: true },
    photos: { type: [String] },
    desc: { type: String, required: true },
    rating: { type: Number, enum: [0, 1, 2, 3, 4, 5] },
    featured: { type: Boolean, default: false },
    rooms: { type: [String] }
})

export default Mongoose.model('Hotel', hotelSchema)