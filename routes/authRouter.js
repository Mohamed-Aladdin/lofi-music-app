import express from 'express';
import AuthController from '../controllers/AuthController';
import { verifyUserFromAuth, verifyUserFromToken } from '../middlewares/auth';

const router = express.Router();

router.post('/login', verifyUserFromAuth, AuthController.login);
router.delete('/logout', verifyUserFromToken, AuthController.logout);

export { router as authRouter };
