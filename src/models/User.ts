import IUser from '../types/user';
import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
        name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      admin: {
          type: Boolean,
          default: false
      },
      confirmed: {
        type: Boolean,
        default: false
      },
      date: {
        type: Date,
        default: Date.now,
      },
})

export default mongoose.model<IUser>('User', UserSchema)