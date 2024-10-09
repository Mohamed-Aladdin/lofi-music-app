import express from 'express';
import SpotifyController from '../controllers/SpotifyController';
import { verifyUserFromToken, verifySpotifyToken } from '../middlewares/auth';

const router = express.Router();

router.get(
  '/topCharts',
  verifyUserFromToken,
  verifySpotifyToken,
  SpotifyController.getTopCharts
);

router.get(
  '/artists/:id',
  verifyUserFromToken,
  verifySpotifyToken,
  SpotifyController.getArtist
);

export { router as spotifyRouter };
