import express from 'express';
import { verifyUserFromToken } from '../middlewares/auth';
import PlaylistsController from '../controllers/PlaylistsController';

const router = express.Router();

router.get(
  '/playlist/:id',
  verifyUserFromToken,
  PlaylistsController.getPlaylist
);

router.post(
  '/playlist',
  verifyUserFromToken,
  PlaylistsController.createPlaylist
);

router.put(
  '/playlist/:id',
  verifyUserFromToken,
  PlaylistsController.updatePlaylist
);

router.put('/playlist/collaborators/:id', verifyUserFromToken, PlaylistsController.addCollaborators);

router.delete('/playlist/collaborators/:id', verifyUserFromToken, PlaylistsController.deleteCollaborators);

router.delete(
  '/playlist/:id',
  verifyUserFromToken,
  PlaylistsController.deletePlaylist
);

router.put(
  '/playlists/favorites/:id',
  verifyUserFromToken,
  PlaylistsController.addFavoritePlaylist
);

router.delete(
  '/playlists/favorites/:id',
  verifyUserFromToken,
  PlaylistsController.deletePlaylistFromFavorites
);
