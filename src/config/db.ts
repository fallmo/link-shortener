import mongoose from 'mongoose'

export const connectDB = () => {
    mongoose.connect(process.env.DB_URI!, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err) => {
        if(err) throw err;
        console.log('Connected to Mongo DB')
    })
}