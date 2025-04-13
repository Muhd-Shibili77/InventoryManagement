import User from "../../domain/entity/User";

export interface IAuthRepository{
    findByEmail(email:string):Promise<User | null>
}