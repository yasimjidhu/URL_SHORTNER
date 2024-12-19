import Jwt from 'jsonwebtoken';
import config from '../../config/env';
import { Request, Response } from 'express';
import { User } from '../../domain/entities/User';
import { OAuth2Client } from 'google-auth-library';
import { AuthenticateUser } from "../../application/use-cases/AuthenticateUser";
import { UserRepository } from "../../infrastructure/repositories/UserRepositoryImpl";
import { GoogleAuthService } from "../../application/services/GoogleAuthService";

export class AuthController {

    async googleSigninCallback(req: Request, res: Response): Promise<any> {
        const { code } = req.query;

        if (!code) {
            return res.status(400).send('Missing authorization code');
        }

        try {
            // Exchange the authorization code for tokens (access token, id token)
            const tokens = await this.exchangeCodeForTokens(code as string);
            const idToken = tokens.id_token; // Extract the id_token

            const googleAuthService = new GoogleAuthService(config.googleClientID!);
            const userRepository = new UserRepository();
            const authenticateUser = new AuthenticateUser(googleAuthService, userRepository);

            // Verify the ID token using GoogleAuthService
            const userInfo = await googleAuthService.verifyToken(idToken!);

            // Save or update the user in the DB
            const user = await userRepository.save(userInfo as User);

            // generate jwt
            const jwtToken = Jwt.sign(
                { id: user.id, email: user.email },
                config.jwtSecret!,
                { expiresIn: '1d' }
            );

            // Set token in an HTTP-only cookie
            res.cookie('token', jwtToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
            });

            // Handle successful login and return user data
            res.status(200).json({ message: 'Successfully authenticated', user });
        } catch (error) {
            console.error('Error during Google OAuth callback:', error);
            res.status(500).send('Error during authentication');
        }
    }

    // Exchange authorization code for tokens
    async exchangeCodeForTokens(code: string) {
        const oauth2Client = new OAuth2Client(config.googleClientID, config.googleClientSecret, config.googleCallbackUrl);
        const { tokens } = await oauth2Client.getToken(code);
        return tokens;
    }
}
