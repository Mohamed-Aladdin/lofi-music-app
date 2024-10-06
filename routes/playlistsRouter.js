import express from 'express';
import { verifyUserFromToken } from '../middlewares/auth';
import PlaylistsController from '../controllers/PlaylistsController';
import SongsController from '../controllers/SongsController';

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

router.put('/:id', verifyUserFromToken, PlaylistsController.addCollaborators);

router.delete(
  '/playlist/:id',
  verifyUserFromToken,
  PlaylistsController.deletePlaylist
);

router.delete('/:id', verifyUserFromToken, PlaylistsController.deleteSong);
