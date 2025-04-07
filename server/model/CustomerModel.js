import mongoose from "mongoose";

const customerSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    
},{ timestamps:true})

const CustomerModel = mongoose.model('Customer',customerSchema)

export default CustomerModel