import Sale from "../../domain/entity/Sale";
import Item from "../../domain/entity/Item";
import Customer from "../../domain/entity/Customer";

export interface ISaleRespository {
    addSale(item:string,quantity:number,price:number,customer:string,totalPrice:number):Promise<Sale>
    getSale():Promise<Sale[]>
    editSale(id:string,item:string,quantity:number,price:number,customer:string,totalPrice:number):Promise<Sale>
    deleteSale(id:string):Promise<void>
    finditemId(itemId:string):Promise<Item | null>
    findcustomerId(customerId:string):Promise<Customer | null>
    addStock(itemId:string,type:string,quantity:number,description:string):Promise<void>
} 