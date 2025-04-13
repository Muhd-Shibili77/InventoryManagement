import { Request,Response } from "express";
import { StockUseCase } from "../../application/useCases/StockUseCase";
import { StatusCode } from "../../application/constants/statusCode";

export class StockController {
    constructor(private stockUseCase: StockUseCase) {}

    async getStock(req: Request, res: Response) {
        try {
            const stocks = await this.stockUseCase.getStock();
            return res.status(StatusCode.OK).json({
                success: true,
                message: "Stock list fetching successfull",
                stocks,
            });
        } catch (error: any) {
            return res.status(StatusCode.BAD_REQUEST).json({
                success: false,
                message: error.message || "Failed to fetch stock",
            });
        }
    }

    async addStock(req: Request, res: Response) {
        try {
            
            const { itemId, stock, description } = req.body;
            const newstock = await this.stockUseCase.addStock(
                itemId,
                stock,
                description
            );
            return res.status(StatusCode.OK).json({
                success: true,
                message: "Stock adding successfull",
                newstock,
            });
        } catch (error: any) {
            return res.status(StatusCode.BAD_REQUEST).json({
                success: false,
                message: error.message || "Failed to add stock",
            });
        }
    }
}