class Item {
    public readonly id!:string;
    public name!:string
    public description!:string
    public quantity!:number
    public price!:number
    public isDelete!:boolean
    public saled!:number
    public updatedAt!:Date

    constructor(data:Partial<Item>){
        Object.assign(this,data)
    }
}

export default Item