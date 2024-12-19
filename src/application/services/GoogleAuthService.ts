import { OAuth2Client } from "google-auth-library";
import config from '../../config/env'

export class GoogleAuthService{
    private client : OAuth2Client;

    constructor(clientId:string){
        this.client = new OAuth2Client(clientId)
    }

    async verifyToken(token:string):Promise<{email:string,name:string}>{
        const ticket = await this.client.verifyIdToken({
            idToken:token,
            audience:config.googleClientID
        })

        const payload = ticket.getPayload();

        if(!payload || !payload.email || !payload.name){
            throw new Error('invalid google token')
        }

        return {email:payload.email,name:payload.name}
    }
}