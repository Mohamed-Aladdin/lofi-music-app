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

router.get(
  '/tracks/:id',
  verifyUserFromToken,
  verifySpotifyToken,
  SpotifyController.getSong
);

router.get(
  '/search',
  verifyUserFromToken,
  verifySpotifyToken,
  SpotifyController.searchSongs
);

router.get(
  '/tracks/genres/:genre',
  verifyUserFromToken,
  verifySpotifyToken,
  SpotifyController.getSongsByGenre
);

router.get(
  '/tracks/related/:id',
  verifyUserFromToken,
  verifySpotifyToken,
  SpotifyController.getRelatedSongs
);

router.get(
  '/tracks/country/:countryCode',
  verifyUserFromToken,
  verifySpotifyToken,
  SpotifyController.getRelatedSongs
);

export { router as spotifyRouter };
