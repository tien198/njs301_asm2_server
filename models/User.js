import Mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
    userName: { type: String, require: true },
    password: { type: String, require: true },
    fullName: { type: String, default: '' },
    phoneNumber: { type: String },
    email: { type: String, default: '' },
    isAdmin: { type: Boolean, default: false }
})

export default Mongoose.model('User', userSchema)