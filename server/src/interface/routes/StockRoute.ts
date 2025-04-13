import { Router,Request,Response } from "express";
import { StockController } from "../controllers/StockController";
import { StockUseCase } from "../../application/useCases/StockUseCase";
import { StockRepository } from "../../infrastructure/repositories/StockRepository";
import { authMiddleware } from "../middlewares/authMiddleware";
const stockRepository = new StockRepository()
const stockUseCase = new StockUseCase(stockRepository)
const stockController = new StockController(stockUseCase)
const router = Router()

router.use(authMiddleware); // Apply auth middleware to all routes

router.route('/')
.get(async (req: Request, res: Response): Promise<void> => {
    await stockController.getStock(req, res); 
})
.post(async (req: Request, res: Response): Promise<void> => {
    await stockController.addStock(req, res);
})

export default router