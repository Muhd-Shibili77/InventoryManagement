import bcrypt from "bcrypt";
import UserModel from "../model/UserModel.js";
import jwt from 'jsonwebtoken';

export const userLogin = async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if(!user){
        return res.status(400).json({message:'user not found'})
    }
    if(!bcrypt.compare(password,user.password)){
        return res.status(400).json({message:'incorrect password'})
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET,{ expiresIn: process.env.JWT_EXPIRATION });
    res.json({ token });
};

export const userRegister = async (req, res) => {


    const {username,email,password} = req.body
    const user = await UserModel.findOne({username})
    if(user){
        return res.status(400).json({message:'user already exist'})
    }
  
    const hashedPassword = await bcrypt.hash(password,10)

    const createdUser =  await UserModel.create({
        username:username,
        email:email,
        password:hashedPassword
    })

    if(createdUser){
        return res.status(200).json({message:'user registration successfull'})
    }
    return res.status(400).json({message:'User Registration Failed'})
};


