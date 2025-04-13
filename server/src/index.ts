import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
dotenv.config()
import connectDB from './infrastructure/config/DB';
import AuthRouter from './interface/routes/AuthRoute'
import SaleRouter from './interface/routes/SaleRoute'
import ItemRouter from './interface/routes/ItemRoute'
import CustomerRouter from './interface/routes/CustomerRoute'
import StockRouter from './interface/routes/StockRoute'

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin:'https://inventora.netlify.app',
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