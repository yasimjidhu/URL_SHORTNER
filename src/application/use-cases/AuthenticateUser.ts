import jwt from 'jsonwebtoken'
import config from '../../config/env'
import { User } from "../../domain/entities/User";
import { GoogleAuthService } from "../services/GoogleAuthService";
import { IUserRepository } from "../../domain/repositories/IUserRepository";

export class AuthenticateUser{
    constructor(
        private googleAuthService:GoogleAuthService,
        private userRepository:IUserRepository
    ){}

    async execute(token:string):Promise<User>{

        // verify the google token
        const {email,name} = await this.googleAuthService.verifyToken(token)
        
        // check if hte user exists in the database
        let user = await this.userRepository.findByEmail(email)

        // if not , create a new User
        if(!user){
            user = await this.userRepository.save(new User('',email,name))
        }

        return user
    }
}