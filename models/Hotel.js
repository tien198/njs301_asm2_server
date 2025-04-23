import Mongoose, { Schema } from 'mongoose';

const hotelSchema = new Schema({
    name: { type: String, require: true },
    type: {
        type: String,
        enum: ['Hotel', 'Apartments', 'Resorts', 'Villas', 'Cabins'],
        required: true
    },
    city: { type: String, require: true },
    address: { type: String, require: true },
    photos: { type: [String] },
    desc: { type: String, require: true },
    rating: { type: Number, enum: [0, 1, 2, 3, 4, 5] },
    featured: { type: Boolean, default: false },
    rooms: { type: [String] }
})

export default Mongoose.model('Hotel', hotelSchema)