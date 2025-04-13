import Item from "../../domain/entity/Item";

export interface IItemRepository {
    addItem(name: string,description:string, price: number, quantity: number): Promise<Item>;
    getItem(): Promise<Item[]>;
    updateItem(id: string, name: string,description:string, price: number, quantity: number): Promise<Item>;
    deleteItem(id: string, isDelete: boolean): Promise<void>;
    findByName(name: string): Promise<Item | null>;
}