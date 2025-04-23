import Mongoose, { Schema } from "mongoose";

const citySchema = new Schema({
    name: { type: String, required: true },
    subText: { type: String, required: true },
    image: { type: String, required: true },
})

export default Mongoose.model('City', citySchema)