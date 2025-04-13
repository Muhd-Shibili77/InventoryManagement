import { ICustomerRepository } from "../interface/ICustomerRepository";

export class CustomerUseCase{
    constructor(private customerRepository : ICustomerRepository){}

    async getCustomer(){
        const customers = await this.customerRepository.getCustomer()
        return customers
    }

    async addCustomer(name:string,address:string,phone:number){
        if(!name || !address || !phone ){
            throw new Error('All field Required')
        }
        const existingCustomer = await this.customerRepository.findByPhone(phone);
        if (existingCustomer) {
            throw new Error('Customer with this phone number already exists');
        }

        const newCustomer = await this.customerRepository.addCustomer(name, address, phone);
        return newCustomer;
    }


    async updateCustomer(id: string, name: string, address: string, phone: number){
        
        if(!id || id == 'undefined'){
            throw new Error('Id Required')
        }
        if(!name || !address || !phone ){
            throw new Error('All field Required')
        }
        const updatedCustomer = await this.customerRepository.updateCustomer(id, name, address, phone);
        if (!updatedCustomer) {
            throw new Error('Failed to update Customer')
        }
        return updatedCustomer;

    }

    async deleteCustomer(id: string,isDelete:boolean){
        if(!id){
            throw new Error('Id Required')
        }
        await this.customerRepository.deleteCustomer(id,isDelete)
        return {
            message: `customer ${!isDelete} successfully`,
        };
    }

    async ledgerCustomer(id:string){
        if(!id){
            throw new Error('Id Required')
        }
        const customer = await this.customerRepository.ledgerCustomer(id)
        return customer
    }
}