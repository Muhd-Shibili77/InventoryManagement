import Stock from "../../domain/entity/Stock";

export interface IStockRepository {
    addStock(itemId:string,type:string,quantity:number,description:string):Promise<Stock>
    getStock():Promise<Stock[]>   
}