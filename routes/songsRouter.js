import express from 'express';
import { verifyUserFromAuth } from '../middlewares/auth';
import SongsController from '../controllers/SongsController';

const router = express.Router();

router.get(
  '/songs/favorites',
  verifyUserFromAuth,
  SongsController.getFavoriteSongs
);
router.post('/songs', verifyUserFromAuth, SongsController.addSongToFavorites);
router.put('/songs/:id', verifyUserFromAuth, SongsController.addSongToPlaylist);
router.delete(
  '/songs/:id',
  verifyUserFromAuth,
  SongsController.removeSongFromFavorites
);

export { router as songsRouter };
