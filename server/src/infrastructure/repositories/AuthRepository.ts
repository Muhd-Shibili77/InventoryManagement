import UserModel from "../models/userModel";
import User from "../../domain/entity/User";
import { IAuthRepository } from "../../application/interface/IAuthRepository";

export class AuthRepository implements IAuthRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return null;
    }
    return new User({
      id: user.id.toString(), 
      username: user.username,
      email: user.email,
      password: user.password,
    });
  }
}
