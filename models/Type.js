import Mogoose, { Schema } from 'mongoose'

const typeSchema = new Schema({
    name: { type: String, required: true },
    count: { type: Number },
    image: { type: String }
})

export default Mogoose.model('Type', typeSchema)