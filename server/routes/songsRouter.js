import express from 'express';
import { verifyUserFromToken } from '../middlewares/auth';
import SongsController from '../controllers/SongsController';

const router = express.Router();

router.get('/favorites', verifyUserFromToken, SongsController.getFavoriteSongs);

router.post(
  '/favorites',
  verifyUserFromToken,
  SongsController.addSongToFavorites
);

router.put('/:id', verifyUserFromToken, SongsController.addSongToPlaylists);

router.delete(
  '/:id',
  verifyUserFromToken,
  SongsController.deleteSongFromPlaylist
);

router.delete(
  '/favorites/:id',
  verifyUserFromToken,
  SongsController.removeSongFromFavorites
);

export { router as songsRouter };
