import mongoose,{Schema,Document} from "mongoose";

export interface Istock extends Document{
    itemId:string,
    type:string,
    quantity:number,
    date:Date,
    description:string,
}

const stockSchema =  new Schema({
    itemId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Item',
        required:true
    },
    type:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        default:new Date()
    },
     description:{
        type:String,
        required:true
    },
},{ timestamps:true})

const StockModel = mongoose.model<Istock>('Stock',stockSchema)
export default StockModel