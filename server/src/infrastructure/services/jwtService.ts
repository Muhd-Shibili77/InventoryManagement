import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config(); 

const JWT_SECRET:Secret = process.env.JWT_SECRET as string
const JWT_REFRESH_SECRET:Secret = process.env.JWT_REFRESH_SECRET as string
const JWT_EXPIRATION = '15m'
const JWT_REFRESH_EXPIRATION = "7d";

export const generateToken =(userId:string):string=>{
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
}

export const generateRefreshToken = (userId:string):string=>{
    return jwt.sign({userId},JWT_REFRESH_SECRET,{expiresIn:JWT_REFRESH_EXPIRATION})
}

export const verifyToken=(token:string):JwtPayload | string =>{
    try {

        return jwt.verify(token, JWT_SECRET);

    } catch (error:any) {
        if (error.name === "TokenExpiredError") {
            throw { status: 401, message: "Token expired" };
        } else if (error.name === "JsonWebTokenError") {
            throw { status: 403, message: "Invalid token" };
        } else {
            throw { status: 500, message: "Internal server error" };
        }
    }
}

export const verifyRefreshToken = (token:string):JwtPayload =>{
    try {
        return jwt.verify(token,JWT_REFRESH_SECRET)as JwtPayload; 
        
    } catch (error:any) {

        if (error.name === "TokenExpiredError") {
            throw { status: 401, message: "Token expired" };
        } else if (error.name === "JsonWebTokenError") {
            throw { status: 403, message: "Invalid token" };
        } else {
            throw { status: 500, message: "Internal server error" };
        }
    }
}

const jwtService = {
    generateToken,
    generateRefreshToken,
    verifyToken,
    verifyRefreshToken
};

export default jwtService;