import mongoose,{Schema,Document} from "mongoose";

export interface Isale extends Document{
    invoiceNumber:string,
    itemId:string,
    quantity:number,
    price:number,
    totalPrice:number,
    date:Date,
    customerId:string
}

const saleSchema =  new Schema({
    invoiceNumber:{
        type:String,
        required:true
    },
    itemId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Item',
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    totalPrice:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        default:new Date()
    },
     customerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Customer',
        required:true
    },
},{ timestamps:true})

const SaleModel = mongoose.model<Isale>('Sale',saleSchema)

export default SaleModel