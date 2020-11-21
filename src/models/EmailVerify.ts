import IEmailVerify from '../types/emailverify';
import mongoose from 'mongoose'

const emailVerify = new mongoose.Schema({
      user_id: {
          type: String,
          required: true,
      }
})

export default mongoose.model<IEmailVerify>('EmailVerify', emailVerify)