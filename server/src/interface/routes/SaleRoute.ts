import { Router,Request,Response } from "express";
import { SaleController } from "../controllers/SaleController";
import { SaleUseCase } from "../../application/useCases/SaleUseCase";
import { SaleRepository } from "../../infrastructure/repositories/SaleRepository";
import { authMiddleware } from "../middlewares/authMiddleware";
const saleRepository = new SaleRepository()
const saleUseCase = new SaleUseCase(saleRepository)
const saleController = new SaleController(saleUseCase)
const router = Router()

router.use(authMiddleware); // Apply auth middleware to all routes


router.route('/')
.get(async (req: Request, res: Response): Promise<void> => {
    await saleController.getSale(req, res); 
})
.post(async (req: Request, res: Response): Promise<void> => {
    await saleController.addSale(req, res);
})

router.route('/:id')
.put(async (req: Request, res: Response): Promise<void> => {
    await saleController.editSale(req, res);
})
.delete(async (req: Request, res: Response): Promise<void> => {
    await saleController.deleteSale(req, res);
})   
router.post('/send-email',async (req: Request, res: Response): Promise<void> => {
    await saleController.sendEmail(req, res); 
})

export default router   