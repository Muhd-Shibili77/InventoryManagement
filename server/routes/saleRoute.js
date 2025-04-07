import express from 'express'
const saleRoute = express.Router()
import { getSales,addSales } from '../controller/saleController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

saleRoute.get('/',authMiddleware,getSales)

saleRoute.post('/add',authMiddleware,addSales)

export default saleRoute