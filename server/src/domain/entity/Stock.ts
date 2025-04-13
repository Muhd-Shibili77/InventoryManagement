class Stock{
    public readonly id!:string;
    public itemId!:string
    public type!:string
    public quantity!:number
    public date!:Date
    public description!:string
    constructor(data:Partial<Stock>){
        Object.assign(this,data)
    }
}

export default Stock