import Item from "../../domain/entity/Item";
import { IItemRepository } from "../../application/interface/IItemRepository";
import ItemModel from "../models/itemModel";

export class ItemRepository implements IItemRepository{
    async addItem(name: string,description:string, price: number, quantity: number): Promise<Item> {
        const createItem = await ItemModel.create({
            name:name,
            price:price,
            quantity:quantity,
            description:description
        })
        return new Item({
            id:createItem.id,
            name:createItem.name,
            price:createItem.price,
            quantity:createItem.quantity,
            description:createItem.description,
            isDelete:createItem.isDelete,
            saled:createItem.saled,
            updatedAt:createItem.updatedAt
        })
    }

    async getItem(): Promise<Item[]> {
        const items = await ItemModel.find()
        return items.map((item)=> new Item({id:item.id,name:item.name,description:item.description,price:item.price,quantity:item.quantity,isDelete:item.isDelete,saled:item.saled,updatedAt:item.updatedAt}))
    }

    async updateItem(id: string, name: string,description:string, price: number, quantity: number): Promise<Item> {
        const updatedItem = await ItemModel.findByIdAndUpdate(id,{name:name,description:description,price:price,quantity:quantity})
        if(!updatedItem){
            throw new Error('Item updation failed')
        }
        return new Item({
            id:updatedItem.id,
            name:updatedItem.name,
            description:updatedItem.description, 
            price:updatedItem.price,
            quantity:updatedItem.quantity,
            isDelete:updatedItem.isDelete,
            saled:updatedItem.saled,
            updatedAt:updatedItem.updatedAt
        })
    }
    async deleteItem(id: string, isDelete: boolean): Promise<void> {
        await ItemModel.findByIdAndUpdate(id,{isDelete:isDelete})
    }

    async findByName(name: string): Promise<Item | null> {
        const item = await ItemModel.findOne({ name });
        if (!item) {
            return null;
        }
        return new Item({
            id: item.id.toString(),
            name: item.name,
            price: item.price,
            description: item.description,
            quantity: item.quantity,
            isDelete: item.isDelete,
            saled: item.saled,
            updatedAt: item.updatedAt,
        });
    }
}