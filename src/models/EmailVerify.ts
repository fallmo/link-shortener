import IEmailVerify from '../types/emailverify';
import mongoose from 'mongoose'

const emailVerify = new mongoose.Schema({
      reference: {
          type: String,
          required: true,
      },
      user_id: {
          type: String,
          required: true,
      }
})

export default mongoose.model<IEmailVerify>('EmailVerify', emailVerify)