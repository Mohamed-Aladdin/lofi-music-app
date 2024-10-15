import express from 'express';
import { verifyUserFromToken } from '../middlewares/auth';
import PlaylistsController from '../controllers/PlaylistsController';

const router = express.Router();

router.get('/', verifyUserFromToken, PlaylistsController.getAllUserPlaylists);

router.get('/:id', verifyUserFromToken, PlaylistsController.getPlaylist);

router.post('/', verifyUserFromToken, PlaylistsController.createPlaylist);

router.put('/:id', verifyUserFromToken, PlaylistsController.updatePlaylist);

router.put(
  '/collaborators/:id',
  verifyUserFromToken,
  PlaylistsController.addCollaborators
);

router.delete(
  '/collaborators/:id',
  verifyUserFromToken,
  PlaylistsController.deleteCollaborators
);

router.delete('/:id', verifyUserFromToken, PlaylistsController.deletePlaylist);

router.put(
  '/favorites/:id',
  verifyUserFromToken,
  PlaylistsController.addFavoritePlaylist
);

router.delete(
  '/favorites/:id',
  verifyUserFromToken,
  PlaylistsController.deletePlaylistFromFavorites
);

export { router as playlistsRouter };
