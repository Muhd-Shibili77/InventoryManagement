import { IItemRepository } from "../interface/IItemRepository";

export class ItemUseCase {
    constructor(private itemRepository: IItemRepository) {}

    async getItem() {
        const items = await this.itemRepository.getItem()
        return items
    }
    async addItem(name: string,description:string, price: number, quantity: number) {
        if (
            !name?.trim() ||
            !price?.toString().trim() ||
            !description?.trim()
          ) {
            throw new Error('All fields are required and cannot be just spaces');
          }
          
        const existingItem = await this.itemRepository.findByName(name.toLowerCase());
        if (existingItem) {
            throw new Error('Item with this name already exists');
        }
        if(price < 1){
            throw new Error('price must be above zero')
        }

        const newItem = await this.itemRepository.addItem(name.toLowerCase(),description.toLowerCase(), price, quantity)
        return newItem
    }

    async updateItem(id: string, name: string,description:string, price: number, quantity: number) {
        if (!id) {
            throw new Error('Id Required')
        }
        if (
            !name?.trim() ||
            !price?.toString().trim() ||
            !description?.trim()
          ) {
            throw new Error('All fields are required and cannot be just spaces');
          }
        if(price < 1){
            throw new Error('price must be above zero')
        }
        const updatedItem = await this.itemRepository.updateItem(id, name.toLowerCase(),description.toLowerCase(), price, quantity)
        if (!updatedItem) {
            throw new Error('Failed to update Item')
        }
        return updatedItem
    }

    async deleteItem(id: string, isDelete: boolean) {
        if (!id) {
            throw new Error('Id Required')
        }
        await this.itemRepository.deleteItem(id, isDelete)
        return {
            message: `Item ${!isDelete} successfully`,
        };
    }
}