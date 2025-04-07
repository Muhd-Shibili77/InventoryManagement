import express from 'express'
const reportRoute = express.Router()
import { saleReport,itemReport, ledgerReport,sendReportEmail } from '../controller/reportController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

reportRoute.get('/sales',authMiddleware,saleReport)

reportRoute.get('/items',authMiddleware,itemReport)

reportRoute.get('/ledger',authMiddleware,ledgerReport)


reportRoute.post("/send-email", authMiddleware, sendReportEmail);

export default reportRoute