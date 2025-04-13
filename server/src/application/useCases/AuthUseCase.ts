import { IAuthRepository } from "../interface/IAuthRepository";
import bcrypt from "bcrypt";
import jwtService from "../../infrastructure/services/jwtService";

export class AuthUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async login(email:string,password:string){
    const user = await this.authRepository.findByEmail(email)

    if(!user){
        throw new Error('User not found')
    }
    const isPassword = await bcrypt.compare(password,user.password)

    if(!isPassword){
        throw new Error('Incorrect Password')
    }
    const Token = jwtService.generateToken(user.id)
    const refreshToken = jwtService.generateRefreshToken(user.id)

    return{
        Token,
        refreshToken
    }
  }
}
