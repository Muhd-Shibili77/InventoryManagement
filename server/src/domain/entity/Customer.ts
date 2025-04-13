class Customer {
    public readonly id!:string;
    public name!:string
    public address!:string
    public phone!:number
    public isDelete!:boolean

    constructor(data:Partial<Customer>){
        Object.assign(this,data)
    }
}

export default Customer