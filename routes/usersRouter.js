import express from 'express';
import UsersController from '../controllers/UsersController';
import { verifyUserFromToken } from '../middlewares/auth';

const router = express.Router();

router.post('/register', UsersController.register);
router.delete('/deleteMe', verifyUserFromToken, UsersController.deleteAccount);

export { router as usersRouter };
