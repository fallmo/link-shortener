import IRefresh from '../types/refresh';
import mongoose from 'mongoose'

const RefreshSchema = new mongoose.Schema({
      token: {
          type: String,
          required: true,
      },
      userAgent: {
          type: String,
          required: true,
      }
})

export default mongoose.model<IRefresh>('Refresh', RefreshSchema)