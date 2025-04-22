import Item from "../../domain/entity/Item";

export interface IItemRepository {
    addItem(name: string,description:string, price: number, quantity: number): Promise<Item>;
    getItem(query:object, page:number, limit:number): Promise<{items:Item[],totalPages:number}>;
    updateItem(id: string, name: string,description:string, price: number, quantity: number): Promise<Item>;
    deleteItem(id: string, isDelete: boolean): Promise<void>;
    findByName(name: string): Promise<Item | null>;
}