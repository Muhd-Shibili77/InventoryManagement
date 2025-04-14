import { IStockRepository } from "../../application/interface/IStockRepository";
import Stock from "../../domain/entity/Stock";
import ItemModel from "../models/itemModel";
import StockModel from "../models/stockModel";

export class StockRepository implements IStockRepository {
    async getStock(): Promise<Stock[]> {
        const stocks = await StockModel.find().populate('itemId').sort({ date: -1 });
        return stocks.map((stock) => new Stock({ id: stock.id, itemId: stock.itemId, type: stock.type, quantity: stock.quantity, date: stock.date, description: stock.description }));
    }

    async addStock(itemId: string, type: string, quantity: number, description: string): Promise<Stock> {
        const itemExist = await ItemModel.findOne({ _id: itemId });
        const stock = await StockModel.create({
            itemId,
            type,
            quantity,
            description
        });
        if(itemExist){
            itemExist.quantity = Number(itemExist.quantity) + Number(quantity);
            await itemExist.save();
        }

        return new Stock({
            id: stock.id,
            itemId: stock.itemId,
            type: stock.type,
            quantity: stock.quantity,
            date: stock.date,
            description: stock.description
        });
    }
}
