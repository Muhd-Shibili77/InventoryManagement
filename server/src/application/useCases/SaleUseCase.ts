import { ISaleRespository } from "../interface/ISaleRepository";
import { MailService } from "../../infrastructure/services/emailService";
export class SaleUseCase {
    constructor(private saleRepository: ISaleRespository) {}

   async getSale() {
        const sales = await this.saleRepository.getSale()
        return sales
    }
    async addSale(item: string, quantity: number, price: number, customer: string, totalPrice: number) {
        if (!item || !quantity || !price || !customer || !totalPrice) {
            throw new Error('All field Required')
        }
        const existingItem = await this.saleRepository.finditemId(item);
        if (!existingItem) {
            throw new Error('Item with this id does not exist');
        }
        if (existingItem.quantity < quantity) {
            throw new Error('Insufficient item quantity');
        }
        if (existingItem.isDelete) {
            throw new Error('Item is deleted');
        }
        const existingCustomer = await this.saleRepository.findcustomerId(customer);
        if (!existingCustomer) {
            throw new Error('Customer with this id does not exist');
        }
        if (existingCustomer.isDelete) {
            throw new Error('Customer is deleted');
        }
        const newSale = await this.saleRepository.addSale(item, quantity, price, customer, totalPrice)
        if(newSale){
            await this.saleRepository.addStock(item, 'outgoing', quantity, `Sale of ${newSale.invoiceNumber}`)
        }
        return newSale
    }

    async editSale(id: string, item: string, quantity: number, price: number, customer: string, totalPrice: number) {
        if (!id) {
            throw new Error('Id Required')
        }
        if (!item || !quantity || !price || !customer || !totalPrice) {
            throw new Error('All field Required')
        }
        const existingItem = await this.saleRepository.finditemId(item);
        if (!existingItem) {
            throw new Error('Item with this id does not exist');
        }
        if (existingItem.quantity < quantity) {
            throw new Error('Insufficient item quantity');
        }
        if (existingItem.isDelete) {
            throw new Error('Item is deleted');
        }

        const existingCustomer = await this.saleRepository.findcustomerId(customer);
        if (!existingCustomer) {
            throw new Error('Customer with this id does not exist');
        }
        if (existingCustomer.isDelete) {
            throw new Error('Customer is deleted');
        }

        const updatedSale = await this.saleRepository.editSale(id, item, quantity, price, customer, totalPrice)
        if (!updatedSale) {
            throw new Error('Failed to update Sale')
        }
        return updatedSale
    }

    async deleteSale(id: string) {
        if (!id) {
            throw new Error('Id Required')
        }
        await this.saleRepository.deleteSale(id)
        return {
            message: `Sale deleted successfully`,
        };
    }

    async sendMail(recipientEmail:string, reportType:string, reportData:any, subject:string){
        if (!recipientEmail || !reportType || !reportData || !subject) {
            throw new Error('All field Required')
        }
        await MailService.sendReportEmail(recipientEmail, reportType, reportData, subject)
        return {
            message: `Email sent successfully`,
        };
    }
}