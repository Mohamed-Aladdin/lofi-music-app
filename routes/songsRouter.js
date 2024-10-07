import express from 'express';
import { verifyUserFromToken } from '../middlewares/auth';
import SongsController from '../controllers/SongsController';

const router = express.Router();

router.get(
  '/songs/favorites',
  verifyUserFromToken,
  SongsController.getFavoriteSongs
);

router.post(
  '/songs/favorites',
  verifyUserFromToken,
  SongsController.addSongToFavorites
);

router.put(
  '/songs/:id',
  verifyUserFromToken,
  SongsController.addSongToPlaylist
);

router.delete(
  '/songs/:id',
  verifyUserFromToken,
  PlaylistsController.deleteSongFromPlaylist
);

router.delete(
  '/songs/favorites/:id',
  verifyUserFromToken,
  SongsController.removeSongFromFavorites
);

export { router as songsRouter };
