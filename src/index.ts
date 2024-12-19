import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'
import config from './config/env'
import connectDB from './infrastructure/database/connect';
import authRoutes from './presentation/routes/authRoutes'
import urlRoutes from './presentation/routes/UrlRoutes';
import analyticsRoutes from './presentation/routes/AnalyticsRoutes'

const app = express();

app.use(cors());
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:true}));

app.use('/auth', authRoutes);
app.use('/url', urlRoutes);
app.use('/analytics',analyticsRoutes);


// connect to the database
connectDB();

const PORT = config.httpPort || 5000

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})

export default app;
