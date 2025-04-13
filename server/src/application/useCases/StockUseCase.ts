import { IStockRepository } from "../interface/IStockRepository";

export class StockUseCase {
    constructor(private stockRepository: IStockRepository) {}
    
    async addStock(
        itemId: string,
        quantity: number,
        description: string
    ) {
        if (!itemId || !quantity || !description) {
            throw new Error("All fields are required");
        }
        const type = 'incoming'
        return await this.stockRepository.addStock(
        itemId,
        type,
        quantity,
        description
        );
    }
    
    async getStock() {
        return await this.stockRepository.getStock();
    }
}