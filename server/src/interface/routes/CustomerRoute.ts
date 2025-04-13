import { Router,Request,Response } from "express";
import { CustomerController } from "../controllers/CustomerController";
import { CustomerUseCase } from "../../application/useCases/CustomerUseCase";
import { CustomerRepository } from "../../infrastructure/repositories/CustomerRepository";
import { authMiddleware } from "../middlewares/authMiddleware";
const customerRepository = new CustomerRepository()
const customerUseCase = new CustomerUseCase(customerRepository)
const customerController = new CustomerController(customerUseCase)
const router = Router()

router.use(authMiddleware);

router.route('/')
.get(async (req: Request, res: Response): Promise<void> => {
    await customerController.getCustomer(req, res); 
})
.post(async (req: Request, res: Response): Promise<void> => {
    await customerController.addCustomer(req, res); 
})
router.route('/:id')
.put(async (req: Request, res: Response): Promise<void> => {
    await customerController.updateCustomer(req, res); 
})
.delete(async (req: Request, res: Response): Promise<void> => {
    await customerController.deleteCustomer(req, res); 
}).get(async (req: Request, res: Response): Promise<void> => {
    await customerController.ledgerCustomer(req, res); 
})

export default router