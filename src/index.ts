import path from 'path'
import express, {Application} from 'express';
import {connectDB} from './config/db'
import authRoutes from './routes/auth';
import dotenv from 'dotenv'

const {error} = dotenv.config({path: path.join(__dirname, 'config', 'config.env')});
if(error || !process.env.APP_NAME) throw new Error("Environment Variables Not Set!");

connectDB()

const app: Application = express();
const PORT = process.env.PORT || 3030;

app.use(express.json());
app.use('/api/v1/auth', authRoutes);
app.listen(PORT, () => console.log('Server PORT: '+PORT));
