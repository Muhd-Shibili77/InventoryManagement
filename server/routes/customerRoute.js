import express from 'express'
const customerRoute = express.Router()
import { getCustomer,addCustomer } from '../controller/customerController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

customerRoute.get('/',authMiddleware,getCustomer)

customerRoute.post('/add',authMiddleware,addCustomer)

export default customerRoute