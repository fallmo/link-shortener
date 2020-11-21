import path from 'path'
import express, {Application} from 'express';
import {connectDB} from './config/db'
import authRoutes from './routes/auth';
import urlRoutes from './routes/url';
import regRoutes from './routes/reg';
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import forcessl  from 'heroku-ssl-redirect'
import * as eta from 'eta'

const {error} = dotenv.config({path: path.join(__dirname, 'config', 'config.env')});
if(error || !process.env.APP_NAME) throw new Error("Environment Variables Not Set!");

connectDB()

const app: Application = express();
const PORT = process.env.PORT || 3030;

app.engine("eta", eta.renderFile);
app.set('view engine', 'eta');  
app.set("views", path.join(__dirname, 'views'))

app.use(cors({credentials: true, origin: [/\.gripurl\.com$/]})); 
app.use(cookieParser());
app.use(forcessl());
app.use(express.json());
app.use("/static",express.static(path.join(__dirname, 'static')))

app.use('/', regRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/urls', urlRoutes)
app.listen(PORT, () => console.log('Server PORT: '+PORT));
