import { Router,Request,Response } from "express";
import { AuthController } from "../controllers/AuthController";
import { AuthUseCase } from "../../application/useCases/AuthUseCase";
import { AuthRepository } from "../../infrastructure/repositories/AuthRepository";

const authRepository = new AuthRepository()
const authUseCase = new AuthUseCase(authRepository)
const authController = new AuthController(authUseCase)
const router = Router()

router.post('/login',async(req:Request,res:Response):Promise<void>=>{
    await authController.loginUser(req,res)
})
router.post('/refresh-token',async(req:Request,res:Response):Promise<void>=>{
    await authController.refreshAccessToken(req,res)
})
export default router