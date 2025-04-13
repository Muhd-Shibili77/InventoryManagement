import mongoose,{Schema,Document} from "mongoose";

export interface IItem extends Document{
    name:string,
    description:string,
    quantity:number,
    price:number,
    isDelete:boolean,
    saled:number,
    updatedAt:Date
}


const itemSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true,
        default:0
    },
    price:{
        type:Number,
        required:true
    },
    isDelete:{
        type:Boolean,
        default:false
    },
    saled:{
        type:Number,
        default:0
    },
},{ timestamps:true})

const ItemModel = mongoose.model<IItem>('Item',itemSchema)

export default ItemModel