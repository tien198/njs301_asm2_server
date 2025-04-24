import Mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
    userName: { type: String, required: true },
    password: { type: String, required: true },
    fullName: { type: String, default: '' },
    phoneNumber: { type: String },
    email: { type: String, default: '' },
    isAdmin: { type: Boolean, default: false }
})

export default Mongoose.model('User', userSchema)