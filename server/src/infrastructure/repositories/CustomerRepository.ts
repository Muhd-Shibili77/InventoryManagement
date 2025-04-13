import { ICustomerRepository } from "../../application/interface/ICustomerRepository";
import Customer from "../../domain/entity/Customer";
import Sale from "../../domain/entity/Sale";
import CustomerModel from "../models/customerModel";
import SaleModel from "../models/saleModel";

export class CustomerRepository implements ICustomerRepository{
    async addCustomer(name: string, address: string, phone: number): Promise<Customer> {
        const customer = await CustomerModel.findOne({name})
        if(customer){
            throw new Error('User already exists')
        }
        const createCustomer = await CustomerModel.create({
            name:name,
            address:address,
            phone:phone
        })

        return new Customer({
            id:createCustomer.id,
            name:createCustomer.name,
            address:createCustomer.address,
            phone:createCustomer.phone,
            isDelete:createCustomer.isDelete
        })
    }

    async getCustomer(): Promise<Customer[]> {
        const customers = await CustomerModel.find()
        return customers.map((customer)=> new Customer({id:customer.id,name:customer.name,address:customer.address,phone:customer.phone,isDelete:customer.isDelete}))
    }

    async updateCustomer(id: string, name: string, address: string, phone: number): Promise<Customer> {
        const updatedCustomer = await CustomerModel.findByIdAndUpdate(id,{name:name,address:address,phone:phone})
        if(!updatedCustomer){
            throw new Error('Failed to update Customer')
        }
        return new Customer({
            id:updatedCustomer.id,
            name:updatedCustomer.name,
            address:updatedCustomer.address,
            phone:updatedCustomer.phone,
            isDelete:updatedCustomer.isDelete
        })
    }

    async deleteCustomer(id: string,isDelete:boolean): Promise<void> {
        await CustomerModel.findByIdAndUpdate(id,{isDelete:isDelete})
    }
    async findByPhone(phone: number): Promise<Customer | null> {
        const customer = await CustomerModel.findOne({ phone });
        if (!customer) {
            return null;
        }
        return new Customer({
            id: customer.id.toString(),
            name: customer.name,
            address: customer.address,
            phone: customer.phone,
            isDelete: customer.isDelete,
        });
}

async ledgerCustomer(id: string): Promise<Sale[] | null> {
    const sale = await SaleModel.find({ customerId: id }).populate('itemId');
    if (!sale) {
        return null;
    }
    return sale.map((sale) => new Sale({
        id: sale.id.toString(),
        invoiceNumber: sale.invoiceNumber,
        itemId: sale.itemId,
        quantity: sale.quantity,
        date: sale.date,
        price: sale.price,
        totalPrice: sale.totalPrice
    }));
}

}
