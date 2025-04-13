import {Router,Request,Response} from "express";
import { ItemController } from "../controllers/ItemController";
import { ItemUseCase } from "../../application/useCases/ItemUseCase";
import { ItemRepository } from "../../infrastructure/repositories/ItemRepository";  
import { authMiddleware } from "../middlewares/authMiddleware";
const itemRepository = new ItemRepository()
const itemUseCase = new ItemUseCase(itemRepository)
const itemController = new ItemController(itemUseCase)  
const router = Router()

router.use(authMiddleware); // Apply auth middleware to all routes
router.route('/')
.get(async (req: Request, res: Response): Promise<void> => {
    await itemController.getItem(req, res); 
})
.post(async (req: Request, res: Response): Promise<void> => {
    await itemController.addItem(req, res); 
})

router.route('/:id')
.put(async (req: Request, res: Response): Promise<void> => {
    await itemController.updateItem(req, res); 
})
.delete(async (req: Request, res: Response): Promise<void> => {
    await itemController.deleteItem(req, res); 
})

export default router
