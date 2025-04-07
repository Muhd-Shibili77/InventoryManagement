import express from 'express'
import connectDB from './config/DB.js';
import authRouter from './routes/authRoute.js';
import customerRoute from './routes/customerRoute.js';
import itemRoute from './routes/itemRoute.js';
import saleRoute from './routes/saleRoute.js';
import reportRoute from './routes/reportRoute.js';
import dotenv from 'dotenv'
import cors from "cors";

dotenv.config()

const app=express()
app.use(express.json())

const port=process.env.PORT || 3000

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));

connectDB()


app.use('/auth',authRouter)
app.use('/customer',customerRoute)
app.use('/item',itemRoute) 
app.use('/sales',saleRoute) 
app.use('/report',reportRoute) 


app.listen(port,()=>{
    console.log(`server is started at http://localhost:${port}`)
})