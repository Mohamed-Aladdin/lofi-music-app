import express from 'express';
import { verifyUserFromAuth } from '../middlewares/auth';
import SongsController from '../controllers/SongsController';

const router = express.Router();

router.put('/songs/:id', verifyUserFromAuth, SongsController.addSongToPlaylist);
