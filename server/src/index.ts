import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
dotenv.config()
import cookieParser from "cookie-parser";

import connectDB from './infrastructure/config/DB';
import AuthRouter from './interface/routes/AuthRoute'
import SaleRouter from './interface/routes/SaleRoute'
import ItemRouter from './interface/routes/ItemRoute'
import CustomerRouter from './interface/routes/CustomerRoute'
import StockRouter from './interface/routes/StockRoute'
const URL = process.env.URL as string;
const app = express()
app.use(express.json())
app.use(cookieParser());

app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin: [URL, 'http://localhost:5173'],
    credentials:true,
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}))

connectDB()

app.use("/auth",AuthRouter)
app.use("/sales",SaleRouter)
app.use("/item",ItemRouter)
app.use("/customer",CustomerRouter)
app.use("/stock",StockRouter)

app.get('/',(req,res)=>{
    res.send('server is working')
})

app.listen(process.env.PORT,()=>{
    console.log(`server is started at http://localhost:${process.env.PORT}`)
})