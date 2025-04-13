import mongoose,{Schema,Document} from "mongoose";

export interface IUser extends Document{
    username:string,
    email:string,
    password:string
}

const userSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
},{ timestamps:true})

const UserModel = mongoose.model<IUser>('User',userSchema)

export default UserModel