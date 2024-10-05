import express from 'express';
import { verifyUserFromToken } from '../middlewares/auth';
import UsersController from '../controllers/UsersController';

const router = express.Router();

router.post('/register', UsersController.register);
router.get('getMe', verifyUserFromToken, UsersController.getMe);
router.put('resetPassword', verifyUserFromToken, UsersController.resetPassword);
router.delete('/deleteMe', verifyUserFromToken, UsersController.deleteAccount);

export { router as usersRouter };
