import Mogoose, { Schema } from 'mongoose'

const typeSchema = new Schema({
    name: { type: String, require: true },
    count: { type: Number },
    image: { type: String }
})

export default Mogoose.model('Type', typeSchema)