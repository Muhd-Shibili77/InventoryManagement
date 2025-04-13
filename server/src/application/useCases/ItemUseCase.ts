import { IItemRepository } from "../interface/IItemRepository";

export class ItemUseCase {
    constructor(private itemRepository: IItemRepository) {}

    async getItem() {
        const items = await this.itemRepository.getItem()
        return items
    }
    async addItem(name: string,description:string, price: number, quantity: number) {
        if (!name || !price ||!description) {
            throw new Error('All field Required')
        }
        const existingItem = await this.itemRepository.findByName(name);
        if (existingItem) {
            throw new Error('Item with this name already exists');
        }

        const newItem = await this.itemRepository.addItem(name,description, price, quantity)
        return newItem
    }

    async updateItem(id: string, name: string,description:string, price: number, quantity: number) {
        if (!id) {
            throw new Error('Id Required')
        }
        if (!name || !price || !quantity ||!description) {
            throw new Error('All field Required')
        }
        const updatedItem = await this.itemRepository.updateItem(id, name,description, price, quantity)
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