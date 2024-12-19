import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = Router();
const authController = new AuthController();

router.get('/google/callback', authController.googleSigninCallback.bind(authController));

export default router;
