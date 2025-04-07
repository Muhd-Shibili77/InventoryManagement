import mongoose from "mongoose";

const itemSchema = mongoose.Schema({
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
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    isDelete:{
        type:Boolean,
        default:false
    }
},{ timestamps:true})

const ItemModel = mongoose.model('Item',itemSchema)

export default ItemModel