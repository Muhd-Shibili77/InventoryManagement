import Customer from "../../domain/entity/Customer";
import Sale from "../../domain/entity/Sale";
export interface ICustomerRepository{
    addCustomer(name:string,address:string,phone:number):Promise<Customer>
    getCustomer():Promise<Customer[]>
    updateCustomer(id:string,name:string,address:string,phone:number):Promise<Customer>
    deleteCustomer(id:string,isDelete:boolean):Promise<void>
    findByPhone(phone:number):Promise<Customer | null>
    ledgerCustomer(id:string):Promise<Sale[] | null>
}