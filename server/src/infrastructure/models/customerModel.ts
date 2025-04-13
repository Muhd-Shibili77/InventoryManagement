import mongoose,{Schema,Document} from "mongoose";

export interface ICustomer extends Document{
    name:string,
    address:string,
    phone:number,
    isDelete:boolean
}

const customerSchema:Schema = new Schema({
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
    isDelete:{
        type:Boolean,
        default:false
    },
    
},{ timestamps:true})

const CustomerModel = mongoose.model<ICustomer>('Customer',customerSchema)

export default CustomerModel