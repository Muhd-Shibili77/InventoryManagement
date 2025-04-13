class Sale {
    public readonly id!:string;
    public itemId!:string
    public invoiceNumber!:string
    public quantity!:number
    public price!:number
    public totalPrice!:number
    public date!:Date
    public customerId!:string

    constructor(data:Partial<Sale>){
        Object.assign(this,data)
    }
}

export default Sale