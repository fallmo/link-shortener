import mongoose from 'mongoose';
import IUrl from '../types/url'

const urlSchema = new mongoose.Schema({
    original_url: {
        type: String,
        required: true
    },
    ref_id: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model<IUrl>('Url', urlSchema);