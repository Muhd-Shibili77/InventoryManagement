import express from 'express'
const itemRoute = express.Router()
import { getItems,addItems,editItems,deleteItems } from '../controller/itemController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

itemRoute.get('/',authMiddleware,getItems)

itemRoute.post('/add',authMiddleware,addItems)

itemRoute.put('/update',authMiddleware,editItems)

itemRoute.delete('/delete',authMiddleware,deleteItems)

export default itemRoute