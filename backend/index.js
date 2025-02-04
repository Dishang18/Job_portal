import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import {connectDB} from './utils/db.js';
import userRoute from './routes/user.route.js';
import companyRoute from './routes/company.route.js';
import jobRoute from './routes/job.route.js';

dotenv.config({});
const app=express();
//middlewares
const PORT=process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions={
    origin: 'http//localhost:5173',
    credentials: true
}

//api
app.use('/api/v1/user', userRoute);
app.use('/api/v1/company',companyRoute);
app.use('/api/v1/job',jobRoute);

app.use(cors(corsOptions));

app.listen(PORT,()=>{
    connectDB();
    console.log(`Server Running on ${PORT}...`);
})