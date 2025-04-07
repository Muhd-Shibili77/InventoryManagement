import mongoose from "mongoose";

const saleSchema = mongoose.Schema({
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

const SaleModel = mongoose.model('Sale',saleSchema)

export default SaleModel