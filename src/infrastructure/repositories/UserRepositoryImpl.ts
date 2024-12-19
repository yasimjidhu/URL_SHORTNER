import { User } from "../../domain/entities/User";
import UserModel from "../database/models/UserModel";
import { IUserRepository } from "../../domain/repositories/IUserRepository";

export class UserRepository implements IUserRepository {
    async findByEmail(email: string): Promise<User | null> {
        const user = await UserModel.findOne({ email });
        if (!user) return null;
        return new User(user._id as string, user.email, user.name);
    }

    async save(user: User): Promise<User> {
        const existingUser = await UserModel.findOne({email:user.email})
        if(existingUser){
            return new User(existingUser._id as string,existingUser.email,existingUser.name,existingUser.googleId)
        }

        // create new user if no existing user is found
        const newUser = await UserModel.create({
            email:user.email,
            name:user.name,
            googleId:user.googleId
        })

        return new User(newUser._id as string,newUser.email,newUser.name,newUser.googleId)
    }
}