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
router.delete(
  '/playlist/:id',
  verifyUserFromToken,
  PlaylistsController.deletePlaylist
);
